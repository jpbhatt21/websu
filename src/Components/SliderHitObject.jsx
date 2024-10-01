import { Container, SimpleMesh } from "@pixi/react";
import { capShader, shader, uniforms, uniforms2 } from "../Utility/Utils";

function Slider({props}) {
	return (
		<Container filters={props.filter}>
			<SimpleMesh
				shader={capShader[props.shaderIndex]}
				geometry={props.startCap}
				texture={uniforms2.uSampler2}
				
			/>
			<SimpleMesh
				shader={shader[props.shaderIndex]}
				geometry={props.sliderMesh}
				texture={uniforms.uSampler2}
			/>
			<SimpleMesh
				shader={capShader[props.shaderIndex]}
				geometry={props.endCap}
				texture={uniforms2.uSampler2}
				
			/>
		</Container>
	);
}

export default Slider;
