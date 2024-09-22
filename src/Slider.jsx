import { Container, SimpleMesh } from "@pixi/react";
import { capShader, shader, uniforms, uniforms2 } from "./Utils";

function Slider({shaderIndex, startCap, endCap, sliderMesh,filter}) {
	return (
		<Container filters={filter}>
			<SimpleMesh
				shader={capShader[shaderIndex]}
				geometry={startCap}
				texture={uniforms2.uSampler2}
				
			/>
			<SimpleMesh
				shader={shader[shaderIndex]}
				geometry={sliderMesh}
				texture={uniforms.uSampler2}
			/>
			<SimpleMesh
				shader={capShader[shaderIndex]}
				geometry={endCap}
				texture={uniforms2.uSampler2}
				
			/>
		</Container>
	);
}

export default Slider;
