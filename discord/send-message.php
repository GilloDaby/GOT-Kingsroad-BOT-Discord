<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../config.php'; // contient DISCORD_BOT_TOKEN
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$channelId = $data['channelId'] ?? null;
$message = $data['message'] ?? null;

if (!$channelId || !$message) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing channelId or message']);
    exit;
}

$response = null;
$httpCode = 0;

// ✅ Appel API Discord
$ch = curl_init("https://discord.com/api/channels/$channelId/messages");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_HTTPHEADER => [
        'Authorization: Bot ' . DISCORD_BOT_TOKEN,
        'Content-Type: application/json'
    ],
    CURLOPT_POSTFIELDS => json_encode(['content' => $message]),
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

$decoded = json_decode($response, true);

// ✅ Gestion des erreurs
if ($response === false || $httpCode >= 400) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to send message',
        'httpCode' => $httpCode,
        'details' => $curlError,
        'discordResponse' => $decoded
    ]);
    exit;
}

echo json_encode(['success' => true]);
