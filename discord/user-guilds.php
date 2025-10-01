<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../config.php'; // ✅ pour DISCORD_BOT_TOKEN

// Vérifie que l'utilisateur est connecté
$accessToken = $_SESSION['discord_token'] ?? null;

if (!$accessToken) {
  http_response_code(401);
  echo json_encode(['error' => 'Not logged in']);
  exit;
}

// Récupère les serveurs de l'utilisateur (sous forme de tableau associatif)
$res = curlJson('https://discord.com/api/users/@me/guilds', 'GET', [
  'Authorization' => 'Bearer ' . $accessToken
], null, true); // ← true ici pour avoir un tableau associatif

// Si erreur API Discord
if (!is_array($res)) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to fetch user guilds']);
  exit;
}

// Filtrer uniquement les guilds où le bot est présent
$botToken = 'Bot ' . DISCORD_BOT_TOKEN;

$filtered = array_filter($res, function ($guild) use ($botToken) {
    $guildId = $guild['id'];
    $url = "https://discord.com/api/guilds/$guildId";

    $check = curlJson($url, 'GET', ['Authorization' => $botToken], null, true);
    return isset($check['id']); // ✅ si le bot a accès à cette guild
});

// Renvoie les guildes accessibles
echo json_encode(array_values($filtered));

// Helper pour requêtes cURL + JSON
function curlJson($url, $method = 'GET', $headers = [], $body = null, $assoc = false) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERAGENT => 'GOT-Kingsroad Auth',
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => array_map(fn($k, $v) => "$k: $v", array_keys($headers), $headers)
    ]);

    if (is_array($body)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($body));
    }

    $res = curl_exec($ch);
    curl_close($ch);
    return json_decode($res, $assoc);
}
