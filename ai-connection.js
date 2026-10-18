export const DEFAULT_AI_URL='https://campus-go-ai.onrender.com';
export function resolveEndpoint(saved='',origin=location.origin){return origin==='https://campus-go-xyw8.onrender.com'&&(!saved||saved.replace(/\/$/,'')===origin)?DEFAULT_AI_URL:saved||origin;}
export const aiConnected=status=>/^(OpenAI|Gemini) 已連線$/.test(status);
