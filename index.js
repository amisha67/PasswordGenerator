// using [] fetch custom 
const inputSlider=document.querySelector("[data-lengthSlider]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyMsg=document.querySelector("[data-copyMsg]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const copyBtn=document.querySelector("[data-copy]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symboleCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateBtn");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;
// uppercaseCheck.checked = true;
handleSlider();
setIndicator('grey');

// set pwlength
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min= inputSlider.min;
    const max= inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)+"% 100%");
}

// using js 5 tarike to change css property: style,set attribute,class
function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min)) + min;
}

function generaterndNumber(){
    return getRndInteger(0,10);
}

function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    // const symbolArr = Array.from(symbols);
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
    // charat btaega uss location p kon sa char present h
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symboleCheck.checked) hasSym=true;
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("grey");
    }
    else if((hasLower || hasUpper)&&(hasNum || hasSym)&&passwordLength>=6){
        setIndicator("green");
    }
    else{
        setIndicator("red")
    }
}
// await tbhi kaam krega jb async fnc k andr likhege
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    // to make copy wala text visible , css k through hoga
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    });
    // special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

function shufflePassword(array){
    //fisher yates method jisme ek array ko pass krr k content ko shuffle krte h
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    // password.length!=0
    copyContent();
})

generateBtn.addEventListener('click',()=>{
    // none of the checkbox are selected
    if(checkCount<=0) return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    // lets start journey to find new pw

    console.log("starting");

    // remove old pw
    if (password.length) password="";

    // // lets put the stuff which are marked
    // if(uppercaseCheck.checked){
    //     password+=generateUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowercase();
    // }
    // if(numbersCheck.checked){
    //     password+=generaterndNumber();
    // }
    // if(symboleCheck.checked){
    //     password+=generateSymbol();
    // }

    // taaki 10 length ka ho to chaaro k baad bhi space bhrne k liye koi to ho
    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(numbersCheck.checked){
        funcArr.push(generaterndNumber);
    }
    if(symboleCheck.checked){
        funcArr.push(generateSymbol);
    }

    // compulsory addition 
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    console.log("compulsory");

    // remaining addition
    for(let i=0;i<(passwordLength-funcArr.length);i++){
        let randIndex=getRndInteger(0,funcArr.length); 
        console.log("randindex"+randIndex+i);
        password+=funcArr[randIndex]();
    }

    console.log("remaining");

    // shuffle the pw
    password=shufflePassword(Array.from(password));

    console.log("shuffling");

    // show in UI
    passwordDisplay.value=password;
    console.log("ui done")
    // calculate strength
    calcStrength();
});