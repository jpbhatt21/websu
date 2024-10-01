import { Container, Sprite } from "@pixi/react";

function HitObject({props}) {
    return ( <Container
        alpha={props.hitObjectOpacity}
        x={props.x * props.scalingFactor}
        y={props.y * props.scalingFactor}>
        <Sprite
            image="/hitcircle.png" //Hitcircle
            height={props.circleSize * props.scalingFactor}
            width={props.circleSize * props.scalingFactor}
            anchor={0.5}
            tint={props.tintColor}
        />
        {props.hitObjectNumber < 10 ?  //If number is less than 10 then just display the number, else display the number in two parts. Numbers greater than 100 are not displayed
        (
            <Sprite //Number
                image={
                    "/Numbers/" + props.hitObjectNumber + ".png" 
                }
                scale={{ x: 0.3 * props.scalingFactor, y: 0.3 * props.scalingFactor }}
                anchor={0.5}
            />
        ) : props.hitObjectNumber < 100 ? (
            <>
                <Sprite //Ten's place
                    image={
                        "/Numbers/" +
                        parseInt(
                            props.hitObjectNumber / 10
                        ) +
                        ".png"
                    }
                    scale={{ x: 0.3 * props.scalingFactor, y: 0.3 * props.scalingFactor }}
                    x={-20 * 0.3 * props.scalingFactor}
                    anchor={0.5}
                />
                <Sprite //One's place
                    image={
                        "/Numbers/" +
                        (props.hitObjectNumber % 10) +
                        ".png"
                    }
                    scale={{ x: 0.3 * props.scalingFactor, y: 0.3 * props.scalingFactor }}
                    x={20 * 0.3 * props.scalingFactor}
                    anchor={0.5}
                />
            </>
        ) : (
            <></>
        )}
        <Sprite
            image="/approachcircle.png" //Approach circle restiing place
            height={(props.circleSize ) * props.scalingFactor}
            width={(props.circleSize ) * props.scalingFactor}
            alpha={props.approachCircleScale > 1 ? props.approachCircleOpacity : 0}
            anchor={0.5}
        />
        <Sprite
            image="/approachcircle.png" //Approach circle 
            height={(props.circleSize ) * props.scalingFactor * props.approachCircleScale}
            width={(props.circleSize ) * props.scalingFactor * props.approachCircleScale}
            alpha={props.approachCircleOpacity}
            anchor={0.5}
            tint={props.tintColor}
        />
    </Container> );
}

export default HitObject;