<script>
    import { fa8, faClock, faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";

    import { GateButton, IconGateButton } from "$lib/windows/buttons";
    import { AndGatePool, BulbGatePool,  ClockGatePool, NAndGatePool, NOrGatePool, NotGatePool, OrGatePool, PowerGatePool, SevenSegmentPool, XNorGatePool, XorGatePool } from "$lib/pools/index.js";

</script>

<div class="flex flex-row items-center h-auto fixed w-1/2 bottom-0 right-0 -translate-y-0 mb-8 mr-8 overflow-x-auto gap-x-4 ui-element">
    <GateButton name="And" color="color-and" onClick={() => AndGatePool.instance.createGate(true)}></GateButton>
    <GateButton name="Or" color="color-or" onClick={() => OrGatePool.instance.createGate(true)}></GateButton>
    <GateButton name="Nand" color="color-nand" onClick={() => NAndGatePool.instance.createGate(true)}></GateButton>
    <GateButton name="Nor" color="color-nor" onClick={() => NOrGatePool.instance.createGate(true)}></GateButton>
    <GateButton name="Not" color="color-not" onClick={() => NotGatePool.instance.createGate(true)}></GateButton>
    <GateButton name="Xor" color="color-xor" onClick={() => XorGatePool.instance.createGate(true)}></GateButton>
    <GateButton name="Xnor" color="color-xnor" onClick={() => XNorGatePool.instance.createGate(true)}></GateButton>
    <IconGateButton fabIcon={faClock} color="color-clock" onClick={() => ClockGatePool.instance.createGate(true)}></IconGateButton>
    <IconGateButton fabIcon={faPowerOff} color="color-power" onClick={() => PowerGatePool.instance.createGate(true)}></IconGateButton>
    <IconGateButton fabIcon={faLightbulb} color="color-bulb" onClick={() => BulbGatePool.instance.createGate(true)}></IconGateButton>
    <IconGateButton fabIcon={fa8} color="color-display" onClick={() => SevenSegmentPool.instance.createGate(true)}></IconGateButton>
</div>