//model card mai
 while (true) {
  const { done, value } = await reader.read()
  
  if (done) break



        ///Infinite loop — jab tak done: true na aaye, chalte raho.
        ////reader.read() har baar call karne pe ek object deta hai:

{ done: false, value: <bytes ka chunk> }   // data aa raha hai
{ done: true, value: undefined }            // stream khatam
Example:
1st call:  { done: false, value: <bytes for "Hello"> }
2nd call:  { done: false, value: <bytes for " world"> }
3rd call:  { done: true }  → break, loop band

const chunk = decoder.decode(value)


     ///Raw bytes ko readable text mein convert karo.
Example:
  value (raw bytes)  →  decoder.decode()  →  chunk (text)

bytes ke andar →  'data: {"text":" world"}\n\n'





   const lines = chunk.split("\n\n").filter(line => line.trim())

//Kabhi kabhi ek chunk mein multiple events ek saath aa jaate hain. Humne backend mein \n\n se separate kiya tha (yaad hai res.write mein), toh yahan wapas usi se todte hain.





line = 'data: {"text":" world"}'

jsonStr = line.replace("data: ", "")
// jsonStr = '{"text":" world"}'

data = JSON.parse(jsonStr)
// data = { text: " world" }   ← ab yeh real JS object hai