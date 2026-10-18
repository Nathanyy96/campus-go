export function providerConfig(){const gemini=!!process.env.GEMINI_API_KEY;return {provider:gemini?'Gemini':'OpenAI',key:gemini?process.env.GEMINI_API_KEY:process.env.OPENAI_API_KEY,model:gemini?(process.env.GEMINI_MODEL||'gemini-3.1-flash-lite'):(process.env.OPENAI_MODEL||'gpt-4.1-mini')};}
export async function geminiReply({config,instructions,history,content,thinking,schema}){
 const parts=content.map(c=>c.type==='input_image'?{inlineData:{mimeType:c.image_url.split(';')[0].slice(5),data:c.image_url.split(',')[1]}}:{text:c.text});
 const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':config.key},body:JSON.stringify({systemInstruction:{parts:[{text:instructions}]},contents:[...history.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]})),{role:'user',parts}],generationConfig:{maxOutputTokens:thinking?1024:512,...(thinking?{responseMimeType:'application/json',responseJsonSchema:schema}:{})}}),signal:AbortSignal.timeout(25000)});
 if(!response.ok){const error=new Error(response.status===429?'免費額度或速率已達上限，請稍後重試。':response.status===400||response.status===401||response.status===403?'Gemini 金鑰或專案權限無法使用，請檢查 Render 設定。':response.status===404?'Gemini 模型無法使用，請檢查 GEMINI_MODEL 設定。':'Gemini 暫時無法回覆。');error.status=response.status===429?429:502;throw error;}
 const data=await response.json();return (data.candidates?.[0]?.content?.parts||[]).filter(p=>!p.thought).map(p=>p.text||'').join('');
}

