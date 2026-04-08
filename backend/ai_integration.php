<?php
require_once 'config.php';

// Call AI API to evaluate answer
function evaluate_answer($question, $user_answer) {
    if (!defined('AI_API_KEY') || empty(AI_API_KEY) || AI_API_KEY === 'AIzaSyD198G4_850BdLTiWtnJDlIcwu98DC1dwo') {
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

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

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
    if (!defined('AI_API_KEY') || empty(AI_API_KEY) || AI_API_KEY === 'AIzaSyD198G4_850BdLTiWtnJDlIcwu98DC1dwo') {
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
?>