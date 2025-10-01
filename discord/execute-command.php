<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

// Récupérer les données envoyées par le frontend
$data = json_decode(file_get_contents('php://input'), true);
$guildId = $data['guildId'] ?? null; // ID du serveur Discord
$command = $data['command'] ?? null; // La commande à exécuter
$channelId = $data['channelId'] ?? null; // L'ID du canal où envoyer le message

// Vérifie si les données nécessaires sont présentes
if (!$guildId || !$command || !$channelId) {
    error_log('Error: Missing guild ID, command, or channel ID');
    echo json_encode(['error' => 'Missing guild ID, command, or channel ID']);
    http_response_code(400);
    exit;
}

try {
    // Vérifier si le token et l'ID du serveur sont définis dans le config.php
    $botToken = DISCORD_BOT_TOKEN;
    $discordApiUrl = "https://discord.com/api/v9/interactions"; // L'URL pour l'API d'interaction de Discord

    // Prépare la requête pour l'API Discord
    $messageData = [
        'type' => 1, // Type d'interaction, pour Slash Commands c'est 1
        'data' => [
            'name' => 'gotkingsroad', // Nom de la commande Slash
            'type' => 1, // Type de commande Slash
            'options' => [
                [
                    'name' => 'message',
                    'type' => 3, // Type 'string' pour l'option message
                    'value' => $command // La commande /gotkingsroad message
                ],
                [
                    'name' => 'channel',
                    'type' => 7, // Type 'channel' pour l'option channel
                    'value' => $channelId // L'ID du canal
                ]
            ]
        ]
    ];

    // Debug: Log des données avant d'envoyer la requête
    error_log('Sending data to Discord API: ' . print_r($messageData, true));

    // Envoie la requête API via cURL
    $ch = curl_init($discordApiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bot ' . $botToken,
        'Content-Type: application/json',
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($messageData));

    // Exécute la requête et récupère la réponse
    $response = curl_exec($ch);
	
	if(curl_errno($ch)) {
    error_log('cURL Error: ' . curl_error($ch));
}
    $responseCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // Debug: Log de la réponse de l'API
    error_log('Discord API response: ' . $response);

    // Gérer la réponse de l'API
    if ($responseCode != 200) {
        error_log('Failed to send message, response code: ' . $responseCode . ', response: ' . $response);
        echo json_encode(['error' => 'Failed to send message', 'details' => $response]);
        http_response_code(500);
    } else {
        echo json_encode(['success' => true, 'response' => $response]);
    }

    curl_close($ch);
} catch (Exception $e) {
    // Gestion des erreurs
    error_log('Exception: ' . $e->getMessage());
    echo json_encode(['error' => 'Exception: ' . $e->getMessage()]);
    http_response_code(500);
}
?>
