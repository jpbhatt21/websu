import { Container, Sprite } from "@pixi/react";

function HitObject({x,y,circleSize,approachCircleScale,approachCircleOpacity,scalingFactor,tintColor,hitObjectNumber,hitObjectOpacity}) {
    return ( <Container
        alpha={hitObjectOpacity}
        x={x * scalingFactor}
        y={y * scalingFactor}>
        <Sprite
            image="/hitcircle.png" //Hitcircle
            height={circleSize * scalingFactor}
            width={circleSize * scalingFactor}
            anchor={0.5}
            tint={tintColor}
        />
        {hitObjectNumber < 10 ?  //If number is less than 10 then just display the number, else display the number in two parts. Numbers greater than 100 are not displayed
        (
            <Sprite //Number
                image={
                    "/Numbers/" + hitObjectNumber + ".png" 
                }
                scale={{ x: 0.3 * scalingFactor, y: 0.3 * scalingFactor }}
                anchor={0.5}
            />
        ) : hitObjectNumber < 100 ? (
            <>
                <Sprite //Ten's place
                    image={
                        "/Numbers/" +
                        parseInt(
                            hitObjectNumber / 10
                        ) +
                        ".png"
                    }
                    scale={{ x: 0.3 * scalingFactor, y: 0.3 * scalingFactor }}
                    x={-20 * 0.3 * scalingFactor}
                    anchor={0.5}
                />
                <Sprite //One's place
                    image={
                        "/Numbers/" +
                        (hitObjectNumber % 10) +
                        ".png"
                    }
                    scale={{ x: 0.3 * scalingFactor, y: 0.3 * scalingFactor }}
                    x={20 * 0.3 * scalingFactor}
                    anchor={0.5}
                />
            </>
        ) : (
            <></>
        )}
        <Sprite
            image="/approachcircle.png" //Approach circle restiing place
            height={(circleSize + 8) * scalingFactor}
            width={(circleSize + 8) * scalingFactor}
            alpha={approachCircleScale > 1 ? approachCircleOpacity : 0}
            anchor={0.5}
        />
        <Sprite
            image="/approachcircle.png" //Approach circle 
            height={(circleSize + 8) * scalingFactor * approachCircleScale}
            width={(circleSize + 8) * scalingFactor * approachCircleScale}
            alpha={approachCircleOpacity}
            anchor={0.5}
            tint={tintColor}
        />
    </Container> );
}

export default HitObject;