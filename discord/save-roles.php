<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$guildId = $data['guildId'] ?? null;
$drogon = $data['drogon'] ?? null;
$peddler = $data['peddler'] ?? null;
$daily = $data['daily'] ?? null;
$weekly = $data['weekly'] ?? null;
$beast = $data['beast'] ?? null;
$limitedDeal = $data['limitedDeal'] ?? null;

$timerChannel = $data['timerChannel'] ?? null;
$warningChannel = $data['warningChannel'] ?? null;
$patchnoteChannel = $data['patchnoteChannel'] ?? null;
$botTutorialChannel = $data['botTutorialChannel'] ?? null;

$drogon = $drogon ?: null;
$peddler = $peddler ?: null;
$daily = $daily ?: null;
$weekly = $weekly ?: null;
$beast = $beast ?: null;
$limitedDeal = $limitedDeal ?: null;
$timerChannel = $timerChannel ?: null;
$warningChannel = $warningChannel ?: null;
$patchnoteChannel = $patchnoteChannel ?: null;
$botTutorialChannel = $botTutorialChannel ?: null;

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

    $stmt = $pdo->prepare(
        "INSERT INTO settings (
            guildId,
            drogonRoleId,
            peddlerRoleId,
            dailyRoleId,
            weeklyRoleId,
            beastRoleId,
            limitedDealRoleId,
            globalTimerChannelId,
            drogonWarningChannelId,
            patchnoteChannelId,
            botTutorialChannelId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            drogonRoleId = VALUES(drogonRoleId),
            peddlerRoleId = VALUES(peddlerRoleId),
            dailyRoleId = VALUES(dailyRoleId),
            weeklyRoleId = VALUES(weeklyRoleId),
            beastRoleId = VALUES(beastRoleId),
            limitedDealRoleId = VALUES(limitedDealRoleId),
            globalTimerChannelId = VALUES(globalTimerChannelId),
            drogonWarningChannelId = VALUES(drogonWarningChannelId),
            patchnoteChannelId = VALUES(patchnoteChannelId),
            botTutorialChannelId = VALUES(botTutorialChannelId)"
    );

    $stmt->execute([
        $guildId,
        $drogon,
        $peddler,
        $daily,
        $weekly,
        $beast,
        $limitedDeal,
        $timerChannel,
        $warningChannel,
        $patchnoteChannel,
        $botTutorialChannel
    ]);

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    error_log("[save-roles.php] DB error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'DB error', 'details' => $e->getMessage()]);
}
