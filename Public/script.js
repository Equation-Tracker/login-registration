//Selecting HTML elements
const home = document.querySelectorAll('.home')[0];
const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const greeting = document.getElementById('greeting');
const logout = document.getElementById('logout');
const msg = document.getElementById('msg');
const userReg = document.getElementById('user-reg');
const userDel = document.getElementById('del');
const delForm = document.getElementById('delete-btn')
const delConfirm = document.getElementById('delete-user');
const userLog = document.getElementById('user-log');
const form = document.querySelector('form');
const emailErr = document.getElementById('emailErr');
const nameErr = document.getElementById('nameErr');
const passErr = document.getElementById('passErr');
const resetBtn = document.getElementById('reset');

//What happens when the page loads/refreshes
window.onload = (e)=>{
    // Check if logged in or not
    console.log(localStorage.getItem('email'));
    if(localStorage.getItem('name')){
        if (location.pathname === '/'){
            greeting.innerHTML = `Hello, ${localStorage.getItem('name')}`;
            userLog.style.display = 'none';
            userReg.style.display = 'none';
            logout.style.display = 'inline-block'
            userDel.style.display = 'inline-block'
        } else if (location.pathname == '/login' || location.pathname == '/register'){
            window.location.replace('/')
        }
    } else {
        if(location.pathname === '/'){
            userLog.style.display = 'inline-block';
            userReg.style.display = 'inline-block';
            logout.style.display = 'none'
            userDel.style.display = 'none'
        }
    }
}

const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const emailRegEx = /^[a-z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const validateLogin = () => {
    let err = 0;
    if (!email.value.length){
        emailErr.innerHTML = "Please provide an email.";
        err++
    } else if(!emailRegEx.test(email.value)){
        emailErr.innerHTML = "Invalid email address."
        err++
    }
    if(!password.value.length){
        passErr.innerHTML = "Enter your password.";
        err++
    }
    if(err === 0) {
        return true
    } else return false
}
const validateRegister = () => {
    // const Obj = {};
    let err = 0;
    if (!email.value.length){
        emailErr.innerHTML = "Please provide an email.";
        err++
    } else if(!emailRegEx.test(email.value)){
        emailErr.innerHTML = "Invalid email address."
        err++
    }
    if(!passwordRegEx.test(password.value)){
        passErr.innerHTML = "Password must be at least 8 characters, contain 1 uppercase, 1 lowercase, 1 number and 1 special character.";
        err++
    }
    if(!name.value){
        console.log(name.value);
        nameErr.innerHTML = "Provide your full name." + name.value
        err++
    }
    if(err === 0) {
        return true
    } else return false
}

if(location.pathname == '/login'){
    resetBtn.addEventListener('click',(e)=>{
        msg.innerHTML = '';
        emailErr.innerHTML = '';
        passErr.innerHTML = '';
    })
    form.addEventListener('change',(e)=>{
        msg.innerHTML = '';
        emailErr.innerHTML = '';
        passErr.innerHTML = '';
    })
    submitBtn.addEventListener('click',(e)=>{
        e.preventDefault();

        if(validateLogin()){
            fetch('/login-user/',{
                method: 'post',
                headers: new Headers({'Content-type':'application/json'}),
                body: JSON.stringify({
                    email: email.value.trim(),
                    password: password.value
                })
            }).then((res) => res.json())
            .then(data => {
                if(data.name){
                    localStorage.setItem('name',data.name);
                    localStorage.setItem('email',data.email);
                    window.location.reload();
                    console.log("Login successful");
                } else {
                    msg.innerHTML = data;
                    console.log(data);
                }
            })
        }
    })
} else if(location.pathname == '/register'){
    resetBtn.addEventListener('click',(e)=>{
        msg.innerHTML = '';
        nameErr.innerHTML = '';
        emailErr.innerHTML = '';
        passErr.innerHTML = '';
    })
    form.addEventListener('change',(e)=>{
        msg.innerHTML = '';
        nameErr.innerHTML = '';
        emailErr.innerHTML = '';
        passErr.innerHTML = '';
    })
    submitBtn.addEventListener('click',(e)=>{
        e.preventDefault();

        if(validateRegister()){
            fetch('/register-user/',{
                method: 'post',
                headers: new Headers({'Content-type':'application/json'}),
                body: JSON.stringify({
                    name: name.value,
                    email: email.value.trim(),
                    password: password.value
                })
            }).then((res) => res.json())
            .then(data => {
                if(data.name){
                    localStorage.setItem('name',data.name);
                    localStorage.setItem('email',data.email)
                    alert("Registration successful");
                    window.location.replace('/');
                } else {
                    msg.innerHTML = data
                }
            })
        }
    })
} else {
    logout.addEventListener('click',(e)=>{
        localStorage.clear()
        window.location.reload();
    })
    userDel.addEventListener('click',(e)=>{
        home.style.display = 'none';
        delConfirm.style.display = 'grid';
        delForm.addEventListener('click',(e=>{
            e.preventDefault();
            fetch('/delete-user/',{
                method:'post',
                headers: new Headers({'Content-type':'application/json'}),
                body:JSON.stringify({
                    email: localStorage.getItem('email'),
                    password: password.value
                })
            }).then(res=>res.json())
            .then(data => {
                if(data.msg){
                    alert("Account deleted successfully");
                    localStorage.clear();
                    location.reload();
                } else {
                    msg.innerHTML = data
                }
            })
        }))
    })
}