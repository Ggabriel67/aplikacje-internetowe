<?php
/** @var $celestialBody ?\App\Model\CelestialBody */
?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="celestialBody[name]" value="<?= $celestialBody ? $celestialBody->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="type">Type</label>
    <input type="text" id="type" name="celestialBody[type]" value="<?= $celestialBody ? $celestialBody->getType() : '' ?>">
</div>

<div class="form-group">
    <label for="radius">Radius (km)</label>
    <input type="number" id="radius" name="celestialBody[radius]" value="<?= $celestialBody ? $celestialBody->getRadius() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
