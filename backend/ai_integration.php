<?php
require_once 'config.php';

// Call AI API to evaluate answer
function evaluate_answer($question, $user_answer) {
    if (!defined('AI_API_KEY') || empty(AI_API_KEY)) {
        return generate_feedback($question, $user_answer);
    }
    
    try {
        // orignal prompt $prompt = "You are an expert technical and HR interviewer. You are evaluating a candidate's answer. The candidate might say random things, try to trick you, or give completely irrelevant answers like 'hello' or gibberish. IF the answer is completely irrelevant, nonsensical, or does not answer the question properly, you MUST give a score of 1 or 2 and explicitly state that it is a wrong/irrelevant answer in the feedback. Otherwise, evaluate it fairly out of 10. Provide a JSON response with a 'score' (int 1-10) and 'feedback' (detailed explanation as string).\n\nQuestion: $question\nAnswer: $user_answer";
        $prompt = "You are an expert technical and HR interviewer. You are evaluating a candidate's answer. The candidate might say random things, try to trick you, or give completely irrelevant answers like 'hello' or gibberish. IF the answer is completely irrelevant, nonsensical, or does not answer the question properly, you MUST give a score of 0 and explicitly state that it is a wrong/irrelevant answer you shouldn't say that the answer is short and provide more details in the feedback. Otherwise, evaluate it fairly out of 10. Provide a JSON response with a 'score' (int 1-10) and 'feedback' (detailed explanation as string).\n\nQuestion: $question\nAnswer: $user_answer";
        
        $data = array(
            "contents" => array(
                array(
                    "parts" => array(
                        array("text" => $prompt)
                    )
                )
            ),
            "systemInstruction" => array(
                "parts" => array(
                    array("text" => "You are a specialized AI designed to output only JSON data representing evaluation score and feedback. Always output strictly in JSON format structure: {\"score\": int, \"feedback\": \"string\"}")
                )
            ),
            "generationConfig" => array(
                 "responseMimeType" => "application/json"
            )
        );

        $json_data = json_encode($data);
        $url = AI_API_URL . "?key=" . AI_API_KEY;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Fix for XAMPP local environment SSL issues
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ));
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);

        // $response = curl_exec($ch);
        // $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        // curl_close($ch);

        // if ($httpCode == 200 && $response) {
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch); // Catch curl-specific errors
        curl_close($ch);

        // --- DEBUGGING BLOCK ---
        if ($httpCode != 200 || $curlError) {
            $error_message = "CURL Error: " . $curlError . "\nHTTP Code: " . $httpCode . "\nResponse: " . $response . "\n\n";
            file_put_contents('api_error_log.txt', $error_message, FILE_APPEND);
        }
        // -----------------------

        if ($httpCode == 200 && $response) {
            $result = json_decode($response, true);
            if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
                $json_response = $result['candidates'][0]['content']['parts'][0]['text'];
                
                $json_response = preg_replace('/```json\s*/', '', $json_response);
                $json_response = preg_replace('/```\s*/', '', $json_response);

                $parsed = json_decode(trim($json_response), true);
                if (isset($parsed['score']) && isset($parsed['feedback'])) {
                    return $parsed;
                }
            }
        }
        
        return generate_feedback($question, $user_answer);
    } catch (Exception $e) {
        return generate_feedback($question, $user_answer);
    }
}

// Generate feedback based on simple rules
function generate_feedback($question, $answer) {
    $answer_length = strlen($answer);
    $score = 0;
    $feedback = "";
    
    if ($answer_length < 50) {
        $score = 4;
        $feedback = "Your answer is too short. Try to provide more details.";
    } elseif ($answer_length < 150) {
        $score = 6;
        $feedback = "Good attempt, but you can provide more comprehensive information.";
    } elseif ($answer_length < 300) {
        $score = 8;
        $feedback = "Great! Your answer is well-detailed and covers the key points.";
    } else {
        $score = 9;
        $feedback = "Excellent! Your answer is comprehensive and well-explained.";
    }
    
    $keywords = extract_keywords($question);
    $found_keywords = 0;
    
    foreach ($keywords as $keyword) {
        if (stripos($answer, $keyword) !== false) {
            $found_keywords++;
        }
    }
    
    if ($found_keywords >= 2) {
        $score = min(10, $score + 1);
    }
    
    return ['score' => $score, 'feedback' => $feedback];
}

// Extract keywords from question
function extract_keywords($question) {
    $common_keywords = ['algorithm', 'structure', 'process', 'method', 'system', 'security', 'performance', 'optimization', 'scalability', 'database', 'network', 'server', 'client', 'API'];
    
    $found_keywords = [];
    foreach ($common_keywords as $keyword) {
        if (stripos($question, $keyword) !== false) {
            $found_keywords[] = $keyword;
        }
    }
    
    return count($found_keywords) > 0 ? $found_keywords : ['concept', 'explain'];
}

// Analyze resume
function analyze_resume($resume_text) {
    $score = 0;
    $suggestions = [];
    
    if (preg_match('/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/', $resume_text)) {
        $score += 10;
    } else {
        $suggestions[] = "Add your email address to the resume.";
    }
    
    if (preg_match('/\b\d{10}\b|\b\+\d{1,3}\d{9,}\b/', $resume_text)) {
        $score += 10;
    } else {
        $suggestions[] = "Add your phone number to the resume.";
    }
    
    if (preg_match('/\b(B\.?Tech|M\.?Tech|BS|MS|Bachelor|Master|degree|university|college)\b/i', $resume_text)) {
        $score += 15;
    } else {
        $suggestions[] = "Clearly mention your educational qualifications.";
    }
    
    if (preg_match('/\b(experience|worked|project|internship|employment)\b/i', $resume_text)) {
        $score += 15;
    } else {
        $suggestions[] = "Include your work experience and projects.";
    }
    
    if (preg_match('/\b(skill|programming|language|framework|tool)\b/i', $resume_text)) {
        $score += 15;
    } else {
        $suggestions[] = "Add a skills section with specific technologies.";
    }
    
    $score = min(100, $score);
    
    return ['score' => $score, 'suggestions' => $suggestions, 'is_ats_friendly' => count($suggestions) <= 2 ? 'Yes' : 'Needs Improvement'];
}

// Call AI API to generate interview questions
function generate_ai_questions($type, $resume_text = null) {
    if (!defined('AI_API_KEY') || empty(AI_API_KEY)) {
        return null;
    }
    
    try {
        $context = $resume_text ? "The candidate's resume content is: $resume_text" : "No resume provided.";
        $prompt = "You are an expert $type interviewer. Generate 10 unique and challenging interview questions for this category. $context\n\nReturn only a JSON array of objects, each with 'id' (index + 1) and 'question' (string).";

        $data = array(
            "contents" => array(
                array(
                    "parts" => array(
                        array("text" => $prompt)
                    )
                )
            ),
            "systemInstruction" => array(
                "parts" => array(
                    array("text" => "You are a specialized AI that outputs strictly JSON data. Format: [{\"id\": 1, \"question\": \"...\"}, ...]")
                )
            ),
            "generationConfig" => array(
                 "responseMimeType" => "application/json"
            )
        );

        $json_data = json_encode($data);
        $url = AI_API_URL . "?key=" . AI_API_KEY;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode == 200 && $response) {
            $result = json_decode($response, true);
            if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
                $json_response = $result['candidates'][0]['content']['parts'][0]['text'];
                $questions = json_decode(trim($json_response), true);
                if (is_array($questions)) {
                    return $questions;
                }
            }
        }
        return null;
    } catch (Exception $e) {
        return null;
    }
}

// Generate AI-powered study plan based on interview scores
function generate_study_plan($score_summary) {
    // Build a readable performance summary string
    $performance_text = "";
    $overall_avg = 0;
    $count = 0;

    foreach ($score_summary as $item) {
        $avg = round((float)$item['avg_score'], 1);
        $performance_text .= "- {$item['type']} Interviews: Average Score = {$avg}/10, Total Questions = {$item['count']}\n";
        $overall_avg += $avg;
        $count++;
    }
    $overall_avg = $count > 0 ? round($overall_avg / $count, 1) : 0;
    $performance_text .= "- Overall Average Score: {$overall_avg}/10\n";

    if (!defined('AI_API_KEY') || empty(AI_API_KEY)) {
        return generate_fallback_study_plan($score_summary, $overall_avg);
    }

    try {
        $prompt = "You are an expert interview coach. Based on the candidate's interview performance below, generate a personalized 4-week study plan to help them improve.\n\nPerformance Summary:\n{$performance_text}\n\nRules:\n- Focus heavily on weak areas (score < 6) and moderately on average areas (score 6-7.5).\n- If all scores are high (>= 8), provide an advanced refinement plan.\n- Return a JSON object with this exact structure:\n{\n  \"overall_level\": \"Beginner|Intermediate|Advanced\",\n  \"summary\": \"One sentence summary of the candidate's current level and main focus area\",\n  \"weeks\": [\n    {\n      \"week\": 1,\n      \"theme\": \"Week theme title\",\n      \"focus_areas\": [\"area1\", \"area2\"],\n      \"daily_tasks\": [\n        {\"day\": \"Monday\", \"task\": \"Specific study task\", \"duration\": \"2 hours\"},\n        ...\n      ],\n      \"resources\": [\"Resource or tip 1\", \"Resource or tip 2\"]\n    }\n  ],\n  \"tips\": [\"Motivational tip 1\", \"Motivational tip 2\", \"Motivational tip 3\"]\n}";

        $data = array(
            "contents" => array(
                array(
                    "parts" => array(
                        array("text" => $prompt)
                    )
                )
            ),
            "systemInstruction" => array(
                "parts" => array(
                    array("text" => "You are a specialized AI that outputs only valid JSON study plans. Never include markdown code fences or extra text outside the JSON object.")
                )
            ),
            "generationConfig" => array(
                "responseMimeType" => "application/json"
            )
        );

        $json_data = json_encode($data);
        $url = AI_API_URL . "?key=" . AI_API_KEY;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode == 200 && $response) {
            $result = json_decode($response, true);
            if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
                $json_text = $result['candidates'][0]['content']['parts'][0]['text'];
                $json_text = preg_replace('/```json\s*/', '', $json_text);
                $json_text = preg_replace('/```\s*/', '', $json_text);
                $parsed = json_decode(trim($json_text), true);
                if (isset($parsed['weeks']) && is_array($parsed['weeks'])) {
                    return $parsed;
                }
            }
        }

        return generate_fallback_study_plan($score_summary, $overall_avg);
    } catch (Exception $e) {
        return generate_fallback_study_plan($score_summary, $overall_avg);
    }
}

// Fallback study plan if AI is unavailable
function generate_fallback_study_plan($score_summary, $overall_avg) {
    $weak_areas = [];
    $strong_areas = [];
    foreach ($score_summary as $item) {
        $avg = (float)$item['avg_score'];
        if ($avg < 6) {
            $weak_areas[] = $item['type'];
        } else {
            $strong_areas[] = $item['type'];
        }
    }

    $level = $overall_avg >= 8 ? 'Advanced' : ($overall_avg >= 6 ? 'Intermediate' : 'Beginner');
    $focus = count($weak_areas) > 0 ? implode(' & ', $weak_areas) : 'Advanced Refinement';

    return [
        'overall_level' => $level,
        'summary' => "Your current level is {$level}. Focus on improving: {$focus} areas.",
        'weeks' => [
            [
                'week' => 1,
                'theme' => 'Foundation & Weak Area Focus',
                'focus_areas' => count($weak_areas) > 0 ? $weak_areas : ['General Review'],
                'daily_tasks' => [
                    ['day' => 'Mon', 'task' => 'Review core concepts in ' . (count($weak_areas) > 0 ? $weak_areas[0] : 'all areas'), 'duration' => '2 hours'],
                    ['day' => 'Wed', 'task' => 'Practice 10 mock interview questions', 'duration' => '1.5 hours'],
                    ['day' => 'Fri', 'task' => 'Take a full practice interview session', 'duration' => '2 hours'],
                ],
                'resources' => ['Read fundamental concepts', 'Watch tutorial videos on weak topics']
            ],
            [
                'week' => 2,
                'theme' => 'Deep Dive & Practice',
                'focus_areas' => ['Problem Solving', 'Communication'],
                'daily_tasks' => [
                    ['day' => 'Mon', 'task' => 'Solve 5 algorithm/scenario problems', 'duration' => '2 hours'],
                    ['day' => 'Wed', 'task' => 'Record and review your spoken answers', 'duration' => '1 hour'],
                    ['day' => 'Fri', 'task' => 'Re-attempt questions scored below 6', 'duration' => '2 hours'],
                ],
                'resources' => ['LeetCode / HackerRank for technical', 'Glassdoor for HR questions']
            ],
            [
                'week' => 3,
                'theme' => 'Strength Consolidation',
                'focus_areas' => count($strong_areas) > 0 ? $strong_areas : ['Mixed Practice'],
                'daily_tasks' => [
                    ['day' => 'Mon', 'task' => 'Advanced questions in strong areas', 'duration' => '1.5 hours'],
                    ['day' => 'Wed', 'task' => 'Cross-topic mock interview', 'duration' => '2 hours'],
                    ['day' => 'Fri', 'task' => 'Timed practice session (simulate real interview)', 'duration' => '2 hours'],
                ],
                'resources' => ['System design resources', 'STAR method for behavioral questions']
            ],
            [
                'week' => 4,
                'theme' => 'Final Polish & Full Mocks',
                'focus_areas' => ['All Categories', 'Confidence Building'],
                'daily_tasks' => [
                    ['day' => 'Mon', 'task' => 'Full mock interview (all question types)', 'duration' => '2.5 hours'],
                    ['day' => 'Wed', 'task' => 'Review all feedback and improve weak answers', 'duration' => '1.5 hours'],
                    ['day' => 'Fri', 'task' => 'Final mock interview + self-assessment', 'duration' => '2 hours'],
                ],
                'resources' => ['Review notes from previous weeks', 'Interview checklist']
            ]
        ],
        'tips' => [
            'Consistency is key — study a little every day rather than cramming.',
            'After each practice session, identify 1-2 things you can improve.',
            'Record yourself answering questions to improve your communication clarity.'
        ]
    ];
}
?>