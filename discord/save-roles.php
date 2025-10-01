<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$guildId = $data['guildId'] ?? null;
$drogon = $data['drogon'] ?? null;
$daily = $data['daily'] ?? null;
$weekly = $data['weekly'] ?? null;
$peddler = $data['peddler'] ?? null;
$botTutorialChannel = $data['botTutorialChannel'] ?? null;

// Champs pour channels (selon ta DB)
$timerChannel = $data['timerChannel'] ?? null;
$warningChannel = $data['warningChannel'] ?? null;

if (!$guildId) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing guild ID']);
    exit;
}

try {
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

    $stmt = $pdo->prepare("
        INSERT INTO settings (
    guildId, drogonRoleId, dailyRoleId, weeklyRoleId, peddlerRoleId,
    globalTimerChannelId, drogonWarningChannelId, botTutorialChannelId
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
    drogonRoleId = VALUES(drogonRoleId),
    dailyRoleId = VALUES(dailyRoleId),
    weeklyRoleId = VALUES(weeklyRoleId),
    peddlerRoleId = VALUES(peddlerRoleId),
    globalTimerChannelId = VALUES(globalTimerChannelId),
    drogonWarningChannelId = VALUES(drogonWarningChannelId),
    botTutorialChannelId = VALUES(botTutorialChannelId)
    ");

    $stmt->execute([
            $guildId, $drogon, $daily, $weekly, $peddler,
    $timerChannel, $warningChannel,
    $botTutorialChannel
    ]);

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    error_log("[save-roles.php] DB error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'DB error', 'details' => $e->getMessage()]);
}
