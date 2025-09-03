//export means its accessable via import
//async means it returns a promise
//message:string means message must be a string
//promise <string> means it must return a string from promise

interface ChatResponse {
  reply: string;
  keywords: string[];
}
export async function sendMessageToServer(message:string) :  Promise<ChatResponse> {


    //await means that we pause here unti completed
    // the route is the route from the flask app
    //header is telling that we are sending json

    //json stringify converts javascript object to a json string
    const res = await fetch("/api/chat", {
        method: "POST",
        headers : {"Content-Type" : "application/json"},
        body: JSON.stringify({message})

    } )

    const data = await res.json();
    return {
        reply:data.reply as string, 
        keywords:data.keywords as string[]
    }
}

export async function getConjugationChart(message:string) : Promise<string> {
    const res = await fetch ("/api/chart", {
        method: "POST",
        headers : {"Content-Type" : "application/json"},
        body: JSON.stringify({message})
    })

    const data = await res.json();

    return data.reply as string
}