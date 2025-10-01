<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

$guildId = $_GET['id'] ?? null;
if (!$guildId) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing guild ID']);
    exit;
}

$botToken = 'Bot ' . DISCORD_BOT_TOKEN;

// Récupérer rôles et canaux via API Discord
$roles = curlJson("https://discord.com/api/guilds/$guildId/roles", 'GET', [
    'Authorization' => $botToken
], null, true);

$channels = curlJson("https://discord.com/api/guilds/$guildId/channels", 'GET', [
    'Authorization' => $botToken
], null, true);

if (!is_array($roles) || !is_array($channels)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch guild info']);
    exit;
}

try {
    // Connexion PDO vers la base bot Discord
    $pdo = new PDO(
        'mysql:host=' . BOT_DB_HOST . ';dbname=' . BOT_DB_NAME . ';charset=utf8mb4',
        BOT_DB_USER,
        BOT_DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

$stmt = $pdo->prepare('SELECT drogonRoleId, dailyRoleId, weeklyRoleId, peddlerRoleId, globalTimerChannelId, drogonWarningChannelId FROM settings WHERE guildId = ?');
    $stmt->execute([$guildId]);
    $config = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
} catch (PDOException $e) {
    // Pour debug, affiche l’erreur
    http_response_code(500);
    echo json_encode(['error' => 'DB connection or query error', 'details' => $e->getMessage()]);
    exit;
}

echo json_encode([
    'roles' => $roles,
    'channels' => $channels,
    'config' => $config
]);

function curlJson($url, $method = 'GET', $headers = [], $body = null, $assoc = false) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERAGENT => 'GOT-Kingsroad Bot',
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
