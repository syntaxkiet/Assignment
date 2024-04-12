const row = 10
const column = 10
let mapArray = [];

let imageURL = [
    "url(Res/landscape1.webp)",
    "url(Res/landscape2.jpg)",
    "url(Res/landscape3.jpeg)",
    "url(Res/landscape4.webp)",
    "url(Res/landscape5.webp)",
    "url(Res/landscape6.webp)",
    "url(Res/landscape7.jpg)",
    "url(Res/landscape8.jpg)",
    "url(Res/landscape9.webp)",
    "url(Res/landscape10.webp)",
];

let catImageURL = [

    "Res/cat1.png",
    "Res/cat2.png",
    "Res/cat3.png",
    "Res/cat4.png",
    "Res/cat5.png",
]


let catList = [];
let zombiesList = [];

let playerPosX;
let playerPosY;

for (let i = 0; i < row; i++) {
    mapArray[i] = [];
    for(let j = 0; j < column; j++)
    {
        mapArray[i][j] = "";
    }
}

function Initialize()
{
    for (let index = 0; index < 3; index++) {
        GenerateCat();
    }

    for (let index = 0; index < 2; index++) {
        GenerateZombies();
    }

    let reroll = true;

    while(reroll)
    { 
    reroll = false;  
    playerPosX = Math.floor(Math.random() * row)
    playerPosY = Math.floor(Math.random() * column)
    catList.forEach(element => {
        if (playerPosX == element.positionX && playerPosY == element.positionY) {
            reroll = true;
        }
    });
    zombiesList.forEach(element => {
        if (playerPosX == element.positionX && playerPosY == element.positionY) {
            reroll = true;
        }
    });
    }
    DrawMap();
    arrayToHTMLTable(mapArray);
    MovementLogic();
}

function Movement(direction)
{
    mapArray[playerPosX][playerPosY] = "";

    switch (direction) {
        case "north":
            playerPosY++; 
            break;
        case "south":
            playerPosY--;
            break;
        case "west":
            playerPosX--;
            break;
        case "east":
            playerPosX++;
            break;
    }

    Update();
}

function Update()
{
    CheckEvent();
    MovementLogic();
    DrawMap();
    arrayToHTMLTable(mapArray);
    ChangeBG();
}

function DrawMap()
{
    mapArray[playerPosX][playerPosY] = "P";
    catList.forEach(element => {
        mapArray[element.positionX][element.positionY] = "C";
    });

    zombiesList.forEach(element => {
        mapArray[element.positionX][element.positionY] = "Z";
    });
    console.log(mapArray);
    console.log(catList);
}

function ChangeBG()
{
    let random = Math.floor(Math.random() * imageURL.length)
    document.getElementById("gamescreen").style.backgroundImage=imageURL[random];
}

function RandomCat()
{
    let random = Math.floor(Math.random() * catImageURL.length)
    return catImageURL[random];
}

function MovementLogic()
{
    document.getElementById("eastBtn").disabled = false;
    document.getElementById("northBtn").disabled = false;
    document.getElementById("westBtn").disabled = false;
    document.getElementById("southBtn").disabled = false;
    document.getElementById("eastBtn").style.background = '#04AA6D';
    document.getElementById("northBtn").style.background = '#04AA6D';
    document.getElementById("westBtn").style.background = '#04AA6D';
    document.getElementById("southBtn").style.background = '#04AA6D';

    if (playerPosX == row-1) {
        document.getElementById("eastBtn").disabled = true;
        document.getElementById("eastBtn").style.background = '#808080';
    }
    if (playerPosY == column-1) {
        document.getElementById("northBtn").disabled = true;
        document.getElementById("northBtn").style.background = '#808080';
    }
    if (playerPosX == 0) {
        document.getElementById("westBtn").disabled = true;
        document.getElementById("westBtn").style.background = '#808080';
    }
    if (playerPosY == 0) {
        document.getElementById("southBtn").disabled = true;
        document.getElementById("southBtn").style.background = '#808080';
    }
}

async function getQuote() {
    
    try {
    const btnElement = document.getElementById("btn");
    const textelement = document.getElementById("textbox");    
    const APIKey = "XnIYy9ksaT9hi2C3NM/zNA==4oMylH627Jz7AY44"
    const options =
    {
        method: "GET",
        headers: { "X-Api-Key": APIKey, },
    }
    const apiURL = "https://api.api-ninjas.com/v1/quotes?category=success"
    const response = await fetch(apiURL, options);
    const data = await response.json();
    
    return data[0].quote;
} 

catch (error) {
    console.log(error);
    return "Error fetching data, try again later";
}

}

async function CheckEvent()
{
    for (let index = 0; index < zombiesList.length; index++) {
        if (playerPosX == zombiesList[index].positionX && playerPosY == zombiesList[index].positionY) {
            const screen = document.getElementById("gamescreen");
            const newImage = document.createElement('img');
            newImage.src = "Res/Zombie.webp";
            screen.append(newImage);
            setTimeout(() => {  alert("ZOMBIE ENCOUNTERED, GAME OVER!");; }, 2000);
            setTimeout(() => {  location.reload(); }, 2000);
        }
    }

    for (let index = 0; index < catList.length; index++) {
        if (playerPosX == catList[index].positionX && playerPosY == catList[index].positionY) {
            catList.splice(index, 1);
            const screen = document.getElementById("gamescreen");
            screen.innerHTML = "";
            const newMessage = document.createElement('h1');
            const newImage = document.createElement('img');
            newImage.src = RandomCat();
            screen.append(newImage);
            newImage.style.width = '100px';
            newMessage.style.top = '0';
            newMessage.style.color = 'white';
            newMessage.style.textShadow = '2px 2px 2px black';
            newMessage.style.textAlign = 'center';
            newMessage.style.fontWeight = 'italics';
            screen.appendChild(newMessage);
            const text = await getQuote();
            newMessage.textContent = text;
            
            if (catList.length == 0) {
            const screen = document.getElementById("gamescreen");
            const newImage = document.createElement('img');
            newImage.src = "Res/rescue.png";
            screen.append(newImage);
            setTimeout(() => {  alert("You have rescued all the cute feline creatures, congratulations. The game will soon restart.");; }, 2000);
            setTimeout(() => {  location.reload(); }, 4000);
            }
        }
        
    }
}

function arrayToHTMLTable(array) {
    if (array.length === 0) return '';
    let html = '<table border="1">';
    const numRows = array[0].length;
    const numCols = array.length;
    for (let i = numRows - 1; i >= 0; i--) {
        html += '<tr>';
        for (let j = 0; j < numCols; j++) {
            html += '<td>';
            if (array[j][i] !== undefined) {
                html += array[j][i];
            }
            html += '</td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    document.getElementById("map").innerHTML = html;
}

function GenerateCat()
{
    const posX = Math.floor(Math.random() * row);
    const posY = Math.floor(Math.random() * column)

    for (let index = 0; index < catList.length; index++) {
        if (posX == catList[index].positionX && posY == catList[index].positionY) {
            GenerateCat();
            return;
        }
        
    }
    
    catList.push({
        positionX: posX,
        positionY: posY,
        type: Math.floor(Math.random() * 5)
    })
}

function GenerateZombies()
{
    const posX = Math.floor(Math.random() * row);
    const posY = Math.floor(Math.random() * column)

    for (let index = 0; index < zombiesList.length; index++) {
        if (posX == zombiesList[index].positionX && posY == zombiesList[index].positionY) {
            GenerateZombies();
            return;
        }
        
    }
    
    zombiesList.push({
        positionX: posX,
        positionY: posY,
        type: Math.floor(Math.random() * 5)
    })
}