<?php

/** @var \App\Model\CelestialBody[] $celestialBodies */
/** @var \App\Service\Router $router */

$title = 'Celestial Body List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Celestial Body List</h1>

    <a href="<?= $router->generatePath('celestial_body-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($celestialBodies as $celestialBody): ?>
            <li><h3><?= $celestialBody->getName() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('celestial_body-show', ['id' => $celestialBody->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('celestial_body-edit', ['id' => $celestialBody->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
