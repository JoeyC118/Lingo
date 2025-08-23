//export means its accessable via import
//async means it returns a promise
//message:string means message must be a string
//promise <string> means it must return a string from promise
export async function sendMessageToServer(message:string) : Promise<string> {


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
    return data.reply as string;



}