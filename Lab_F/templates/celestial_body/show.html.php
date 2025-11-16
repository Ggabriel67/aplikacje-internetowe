<?php

/** @var \App\Model\CelestialBody $celestialBody */
/** @var \App\Service\Router $router */

$title = "{$celestialBody->getName()} ({$celestialBody->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $celestialBody->getName() ?></h1>
    <article>
        <p><strong>Type:</strong> <?= $celestialBody->getType() ?></p>
        <p><strong>Radius:</strong> <?= $celestialBody->getRadius() ?> km</p>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('celestial_body-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('celestial_body-edit', ['id'=> $celestialBody->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
