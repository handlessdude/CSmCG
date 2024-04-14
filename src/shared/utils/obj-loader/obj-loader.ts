interface ObjData {
  vertices: Array<number[]>;
  texCoords: Array<number[]>;
  normals:Array<number[]>;
  indices? :Array<number>;
  vertexPerFace: number;
  vertexCount: number;
  faceCount: number;
}

export type {
  ObjData
}

export class OBJParser {
  async load(url: string): Promise<ObjData> {
    const response = await fetch(url);
    const data = await response.text();
    return this.parse(data);
  }

  parse(data: string): ObjData {

    // same order as `f` indices
    const objVertexData: Omit<ObjData, 'faceCount' | 'vertexCount'| 'vertexPerFace'> = {
      vertices: [],
      texCoords: [],
      normals: [],
    };
    const objVertexDataKeys = Object.keys(objVertexData);

    // same order as `f` indices
    const webglVertexData: ObjData = {
      vertices: [],
      texCoords: [],
      normals: [],
      vertexPerFace: 0,
      vertexCount: 0,
      faceCount: 0,
    };

    const lines = data.split('\n');

    lines.forEach((line) => {
      const tokens = line.trim().split(/\s+/);
      const type = tokens.shift();

      switch (type) {
        case 'v':
          webglVertexData.vertexCount += 1;
          objVertexData.vertices.push(tokens.map(parseFloat));
          break;
        case 'vt':
          objVertexData.texCoords.push(tokens.map(parseFloat));
          break;
        case 'vn':
          objVertexData.normals.push(tokens.map(parseFloat));
          break;
        case 'f':
          if (!webglVertexData.vertexPerFace) {
            webglVertexData.vertexPerFace = tokens.length;
          }
          webglVertexData.faceCount += 1;
          tokens.forEach((token) => {
            const splitted = token.split('/');
            if (splitted.length > 3) return;
            const [vInd, vtInd, vnInd] = splitted.map(
              (objIdx, i) => {
                let result = parseInt(objIdx, 10);
                if (result < 0)
                  result += (objVertexData[objVertexDataKeys[i]].length);
                return result - 1; // all indices in obj start from 1
              }
            );
            webglVertexData.vertices.push(objVertexData.vertices[vInd]);
            webglVertexData.texCoords.push(objVertexData.texCoords[vtInd]);
            webglVertexData.normals.push(objVertexData.normals[vnInd]);
          });
          break;
        default:
          console.log(`Undefined token type: "${type}"`);
      }
    });

    return webglVertexData;
  }
}
