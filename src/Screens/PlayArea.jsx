import { useEffect, useMemo, useState, useRef } from "react";
import { backgroundImage, decodeBeatMap, music, pause, play, useWindowDimensions } from "../Utility/Utils";
import { Container, Stage } from "@pixi/react";
import { ColorMatrixFilter, Geometry } from "pixi.js";
import HitObject from "../Components/HitObject";
import Slider from "../Components/SliderHitObject";
import { settings } from "../SettingsValues";
// import { setClear } from "./Components/MessageBox";

let delay = 0;
let eventListenerAttached = false;
let colFil = new ColorMatrixFilter();
let b = 1;
let c = 1;
let d = b + c;
let scalingFactor = 1;
let horizontalOffset = 1;
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
export function bezier(t) {
	return t * t * (3.0 - 2.0 * t);
}
function rgbToHex(rgb) {
	colFil = new ColorMatrixFilter();
	try {
		let t = rgb.split(",");
		let r = parseInt(t[0]).toString(16);
		let g = parseInt(t[1]).toString(16);
		let b = parseInt(t[2]).toString(16);
		if (r.length == 1) r = "0" + r;
		if (g.length == 1) g = "0" + g;
		if (b.length == 1) b = "0" + b;
		colFil.tint("#" + r + g + b);
		return "#" + r + g + b;
	} catch (e) {
		return "#dddddd";
	}
}
function calculateHitObjectOpacity(delta) {
	let opacity = 0.9999;
	if (-d < delta && delta < -b) {
		opacity = bezier(1 + (delta + b) / c);
	} else if (0 < delta && delta < c) {
		opacity = bezier(1 - delta / c);
	}
	return opacity;
}
function calculateApproachCircleScale(delta) {
	let sc = 1;
	if (-d < delta && delta < 0) {
		sc = 1 + 2 * bezier(-delta / d);
	}
	return sc;
}
function calculateApproachCircleOpacity(delta) {
	let op = 0;
	if (-d < delta && delta < 0) {
		op = bezier(1 + delta / d);
	} else if (0 <= delta && delta < c) {
		op = bezier(1 - delta / c);
	}
	return op;
}
function getSliderPerct(delta, len) {
	let perct = 1;
	if (-d < delta && delta < -b) {
		perct = bezier(1 + (delta + b) / c);
	}
	return Math.round(perct * len);
}
function getGeometry(arr, limit) {
		const geometry = new Geometry();
		geometry.addAttribute(
			"aVertexPosition",
			arr[0].slice(0, (limit + 1) * 12).map((x) => x * scalingFactor),
			2
		);
		geometry.addAttribute(
			"aUvs",
			"000110101101"
				.repeat(arr[1])
				.split("")
				.map((x) => parseInt(x)),
			2
		);
		return geometry;
	}
	function getCapGeometry(arr) {
		const geometry = new Geometry();
		geometry.addAttribute(
			"aVertexPosition",
			arr.map((x) => x * scalingFactor),
			2
		);
		geometry.addAttribute("aUvs", [1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0], 2);
		return geometry;
	}
function PlayArea({ props, extraProps }) {
    const [approachRate, setApproachRate] = useState(0);
    const [hpDrain, setHpDrain] = useState(0);
    const [circleSize, setCircleSize] = useState(0);
    const [hitObjects, setHitObjects] = useState([]);
    const [hitObjectNumbers, setHitObjectNumbers] = useState([]);
    const [colors, setColors] = useState([]);
    const [completionColors, setCompletionColors] = useState("163, 190, 140|".repeat(4).split("|").slice(0, 4));
    const { height, width } = useWindowDimensions();

    // 2. Manage time with useRef and trigger re-renders with a frame count state
    const time = useRef(0.0001);
    const [frameCount, setFrameCount] = useState(0);
    const animationFrameId = useRef(null);
	console.log(time.current)
    useEffect(() => {
        b = approachRate / 2;
        c = approachRate / 4;
        d = b + c;
    }, [approachRate]);

    useEffect(() => {
        scalingFactor = height / 480;
        horizontalOffset = (width - (4 * height) / 3) / 2;
    }, [height, width]);

    function keyaction(e) {
		try {
			if (!playArea) {
			}
		} catch (e) {
			document.removeEventListener("keydown", keyaction);
			eventListenerAttached = false;
			return;
		}
		try {
			if (e.repeat || (music.paused && !pauseMenu)) return;
		} catch (e) {
			return;
		}
		if (e.key == "Escape" || e.code == "Space") {
			if (!music.paused) {
				pause();
				extraProps.setShowPause(true);
			} else {
				pauseMenu.style.opacity = "0";
				pauseMenu.style.pointerEvents = "none";
				setTimeout(() => {
					extraProps.setShowPause(false);
					play();
				}, 1000);
			}
		}
	}

    const renderedHitObjects = useMemo(() => {
        return hitObjects
            .map((x) => {
                // 3. Use time.current for calculations
                let deltaTime = time.current - x[1] - d;
                let hitObjectOpacity = calculateHitObjectOpacity(deltaTime);
                let approachCircleOpacity = calculateApproachCircleOpacity(deltaTime);
                let approachCircleScale = calculateApproachCircleScale(deltaTime);
                let tintColor = rgbToHex(colors[x[2]]);
                let hitObjectNumber = hitObjectNumbers[x[2]];
                let index = x[2];
                if (!(-d < deltaTime && deltaTime < c)) {
                    // This empty block can be removed for clarity if it does nothing
                } else if (x[0] == 0)
                    return (
                        <HitObject
                            props={{
                                x: x[3][0],
                                y: x[3][1],
                                circleSize,
                                approachCircleScale,
                                approachCircleOpacity,
                                scalingFactor,
                                tintColor,
                                hitObjectNumber,
                                hitObjectOpacity,
                            }}
                            key={"hitObject" + index}
                        />
                    );
                else if (x[0] < 4) {
                    let slp = getSliderPerct(deltaTime, x[3][3]);
                    return (
                        <Container key={"hitObject" + x[2]}>
                            <Slider
                                props={{
                                    shaderIndex: parseInt(hitObjectOpacity * 100),
                                    startCap: getCapGeometry(x[3][2][0]),
                                    endCap: getCapGeometry(x[3][2][1][slp]),
                                    sliderMesh: getGeometry(x[3], slp),
                                    filter: [colFil],
                                }}
                            />
                            <HitObject
                                props={{
                                    x: (x[3][0][0] + x[3][0][2]) / 2,
                                    y: (x[3][0][1] + x[3][0][3]) / 2,
                                    circleSize,
                                    approachCircleScale,
                                    approachCircleOpacity,
                                    scalingFactor,
                                    tintColor,
                                    hitObjectNumber,
                                    hitObjectOpacity,
                                }}
                                key={"hitObject" + index}
                            />
                        </Container>
                    );
                }
            })
            .reverse();
    // 4. Depend on frameCount to re-calculate visuals every frame
    }, [hitObjects, frameCount, colors, circleSize]); // Added more stable dependencies

    useEffect(() => {
        let isMounted = true; // Flag to prevent state updates if component unmounts
        backgroundImage.style.filter = "blur(" + settings.Gameplay["Background Blur"].value / 5 + "px) brightness(" + (1 - settings.Gameplay["Background Dim"].value / 100) + ")";
        music.pause();
        music.currentTime = 0;
        
        const openDB = indexedDB.open(props.online ? "tempWebsuStorage" : "websuStorage", 2);

        openDB.onsuccess = (dbOpening) => {
            const db = dbOpening.target.result;
            const transaction = db.transaction("Files").objectStore("Files").get(props.setId);

            transaction.onsuccess = async (fileOpening) => {
                if (!isMounted) return;

                const file = fileOpening.target.result.files.find((x) => x.id == props.id);
                await sleep(300);
                if (!isMounted) return;
                
                extraProps.setShowPause(false);
                let beatMap = await decodeBeatMap(file.file, props.setId, props.online);
                await sleep(200);
                if (!isMounted) return;

                load.style.opacity = 0;
                await sleep(1000);
                if (!isMounted) return;

                if (!eventListenerAttached) {
                    document.addEventListener("keydown", keyaction);
                    eventListenerAttached = true;
                }
                extraProps.setShowLoading(false);
                setHitObjects(beatMap[2]);
                setApproachRate(beatMap[0] * 2);
                setCircleSize(beatMap[1] * 2);
                setHitObjectNumbers(beatMap[3]);
                setColors(beatMap[4]);
                setCompletionColors(beatMap[6]);
                time.current = 0;

                let audioDelay = (settings.Audio["Audio Offset"].value - 50) / 50 + beatMap[0] * 4 / 3;

                // Game Loop Logic
                const runGameLoop = () => {
                    const startTime = performance.now();
                    
                    const introLoop = (now) => {
                        const elapsed = (now - startTime) / 1000;
                        if (elapsed >= audioDelay){//beatMap[0] * 4 / 3+(audioDelay > 0 ? audioDelay : 0)) {
                            if (beatMap[5]) backgroundVideo.play();
                            music.play();
                            mainLoop(performance.now()); // Start main loop
                        } else {
                            time.current = parseFloat(elapsed.toFixed(2));
                            setFrameCount(c => c + 1);
                            animationFrameId.current = requestAnimationFrame(introLoop);
                        }
                    };

                    const mainLoop = () => {
                        if (music.currentTime >= music.duration || !isMounted) {
                            // Song finished or component unmounted
                            if (isMounted && music.currentTime >= music.duration) {
                                (async () => {
                                    await sleep(200);
                                    extraProps.setShowTopBar(true);
                                    extraProps.setShowSongMenu(true);
                                    playArea.style.opacity = "0";
                                    // ... other cleanup logic ...
                                    setTimeout(() => extraProps.setShowGame(false), 300);
                                })();
                            }
                            return;
                        }
                        time.current = parseFloat(music.currentTime.toFixed(2)) + audioDelay;
                        setFrameCount(c => c + 1);
                        animationFrameId.current = requestAnimationFrame(mainLoop);
                    };

                    animationFrameId.current = requestAnimationFrame(introLoop);
                };

                if (audioDelay < 0) {
                    if (beatMap[5]) backgroundVideo.play();
                    music.play();
                    await sleep(-audioDelay * 1000);
                    if (isMounted) runGameLoop();
                } else {
                    runGameLoop();
                }
            };
        };

        return () => {
            // 5. Cleanup function
            isMounted = false;
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            document.removeEventListener("keydown", keyaction);
            eventListenerAttached = false;
            music.pause();
        };
    }, []); // This effect should only run once on mount

    let md4 = music.duration / 4;
    return (
        <>
            <div className="w-full h-full flex flex-col justify-center items-center fixed" id="playArea">
                <Stage
                    height={height}
                    width={width}
                    options={{ backgroundColor: 0x000000, backgroundAlpha: 0 }}>
                    <Container x={horizontalOffset + 64 * scalingFactor} y={64 * scalingFactor}>
                        {renderedHitObjects}
                    </Container>
                </Stage>

                {/* 6. Use time.current for calculating progress bar styles */}
                <div
                    className="fixed z-40 rounded-full top-0 right-0 w-2 "
                    style={{
                        height: (time.current / md4) * 100 + "%",
                        background: "linear-gradient(180deg, rgb(" + completionColors[0] + ") 0vh, rgb(" + completionColors[1] + ") 100vh",
                    }}></div>
                <div
                    className="fixed z-40 rounded-full bottom-0 right-0 h-2 bg-colors-green"
                    style={{
                        width: ((time.current - md4) / md4) * 100 + "%",
                        background: "linear-gradient(270deg, rgb(" + completionColors[1] + ") 0vw, rgb(" + completionColors[2] + ") 100vw",
                    }}></div>
                <div
                    className="fixed z-40 rounded-full bottom-0 left-0 w-2 bg-colors-green"
                    style={{
                        height: ((time.current - 2 * md4) / md4) * 100 + "%",
                        background: "linear-gradient(0deg, rgb(" + completionColors[2] + ") 0vh, rgb(" + completionColors[3] + ") 100vh",
                    }}></div>
                <div
                    className="fixed z-40 rounded-full top-0 left-0 h-2 bg-colors-green"
                    style={{
                        width: ((time.current - md4 * 3) / md4) * 100 + "%",
                        background: "linear-gradient(90deg, rgb(" + completionColors[3] + ") 0vw, rgb(" + completionColors[0] + ") 100vw",
                    }}></div>
            </div>
        </>
    );
}


export default PlayArea;
