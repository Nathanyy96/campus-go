/** Campus Go v0.12 scene manifest reader. Pure lookups: never mutate the world. */
export function validateSceneManifest(data){
  if(!data || !Array.isArray(data.places) || !Array.isArray(data.edges))throw Error('Invalid scene manifest');
  const ids = new Set(data.places.map(x=>x.place_id));
  if(ids.size !== 31 || data.places.length !== 31 || data.edges.length !== 42)throw Error('Scene manifest does not match v0.5 map baseline');
  for(const s of data.places){
    if(!s.place_id || !Array.isArray(s.anchors) || !Array.isArray(s.neighbors))throw Error('Malformed scene: '+s.place_id);
    if(new Set(s.anchors.map(a=>a.anchor_id)).size!==s.anchors.length)throw Error('Duplicate scene anchor: '+s.place_id);
    for(const a of s.anchors)if(!Number.isFinite(a.x_norm)||!Number.isFinite(a.y_norm)||a.x_norm<0||a.x_norm>1||a.y_norm<0||a.y_norm>1)throw Error('Out-of-bounds anchor: '+s.place_id);
  }
  return data;
}
export async function loadSceneManifest(fetcher=fetch){
  const r=await fetcher('./data/scene-manifest.json');
  if(!r.ok)throw Error('Scene manifest fetch failed');
  return validateSceneManifest(await r.json());
}
export function resolveScene(manifest,placeId){
  return manifest?.places.find(p=>p.place_id===placeId)??null;
}
