const showRegisterBtn = document.querySelector('#show-register');
const showLoginBtn = document.querySelector('#show-login');
const registerBtn = document.querySelector('#registerBtn');
const registerUsername = document.querySelector('#registerUsername');
const registerPassword = document.querySelector('#registerPassword');
const welcomeMessage = document.querySelector('#welcomeMessage');
const label = document.querySelectorAll('label');
const channels = document.querySelector('.channels');
const channelRight = document.querySelector('.right h2');
const channelsForm = document.querySelector('.channels-form');
const messageInput = document.querySelector("#message-input");
const messageList = document.querySelector(".message-list");
const sendButton = document.querySelector("#send-button");
const registerForm = document.querySelector('.register-form');
const loginP = document.querySelector('#login-p');
const loginBtn = document.querySelector('#loginBtn');
const logoutBtn = document.querySelector('#logoutBtn');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const profile = document.querySelector('.profile');
const loginForm = document.querySelector('.login-form');
const api_users_login_endpoint = "/api/users/login";


let selectedDiv = null;
let currentChannelId = 0;
let currentUserId = 0;

let privacy;
const api_users_autologin_endpoint = "/api/users/autologin";
const api_users_endpoint = "/api/users/getuser"

loginForm.style.display = 'none';
registerForm.style.display = 'none';
profile.style.display = 'none';
channelsForm.style.display = 'none';

showRegisterBtn.addEventListener('click', () => {
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
});

showLoginBtn.addEventListener('click', () => {
  loginForm.style.display = 'block';
  registerForm.style.display = 'none';
});




const api_channels_endpoint = "/api/channels";

fetch(api_channels_endpoint)
  .then((response) => {
    return response.json();
  })
  .then((data) => {

    let output = "";
    data.channels.forEach((item) => {
      output = `${item.channelName} ${item.privacy}`;
      let elements = document.createElement("div");
      elements.innerHTML = output;
      elements.setAttribute("data-channel-id", item.channelId);
      channels.appendChild(elements)
    });

  })


function appendDiv(text) {
  const newDiv = document.createElement("div");
  newDiv.innerText = text;
  let elements = document.querySelectorAll("main div");
  let element = elements[ 0 ].children[ 0 ];
  element.appendChild(newDiv);
}




channels.addEventListener('click', function (event) {
  if (event.target.tagName === 'DIV' && !event.target.classList.contains('channels') && !event.target.classList.contains('channels-form')) {
    if (event.target === selectedDiv) {
      selectedDiv.style.backgroundColor = '';
      selectedDiv = null;
      channelRight.innerText = '';
      currentChannelId = 0;
      clearMessages();
    } else {
      if (currentUserId === 0 && event.target.innerText.includes("Private")) {
        console.log('Wrong. Not logged in');
        return;
      }
      if (selectedDiv) {
        selectedDiv.style.backgroundColor = '';
      }
      clearMessages();
      selectedDiv = event.target;
      event.target.style.backgroundColor = 'blue';
      channelRight.innerText = event.target.innerText;
      currentChannelId = event.target.dataset.channelId;


      fetch(api_channels_endpoint + `/${currentChannelId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        }
      })
        .then((response) => {
          return response.json();
        }).then(async (data) => {
          for (const item of data.messages) {
            const messageDiv = document.createElement("div");

            if (item.userId == 0) {
              messageDiv.innerText = "Unkown " + item.date + " " + item.messageText;
              messageDiv.classList.add("message");
              messageDiv.classList.add("framed");
              messageList.appendChild(messageDiv)
            } else {
              const username = await fetchUsername(item.userId);

              messageDiv.innerText = username + " " + item.date + " " + item.messageText;
              messageDiv.classList.add("message");
              messageDiv.classList.add("framed");
              messageList.appendChild(messageDiv)
            }
          }

        })
    }
  }

});

function clearMessages() {
  while (messageList.firstChild) {
    messageList.removeChild(messageList.firstChild);
  }
}

messageInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter" && messageInput.value && selectedDiv) {
    addMessage();
  }
});

sendButton.addEventListener("click", function () {
  if (messageInput.value && selectedDiv) {
    addMessage();
  }
});

async function fetchUsername(userId) {
  let testUser;
  try {
    await fetch(api_users_endpoint + `/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token')
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      if (data.status === "success") {
        console.log('fetch user successful', data);
        testUser = data.username;
        return data.username;
      } else if (data.status === "unauthorised") {
        console.log('401: unauthorised');
      }
    });
  } catch (error) {
    console.error('Error while fetching user data:', error.message);
    return userId;
  }
  return testUser;
}

function addMessage() {
  const messageDiv = document.createElement("div");
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const currentTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

  const requestData = {
    message: messageInput.value,
    date: currentTime,
    userId: currentUserId,
    channelId: currentChannelId,
  };


  const api_messages_endpoint = "/api/messages";
  fetch(api_messages_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  })
    .then((res) => res.json())
    .then(async (data) => {
      if (data.status === "success") {



        if (currentUserId == 0) {
          messageDiv.innerText = `Unkown ${currentTime} ${messageInput.value}`;
        } else {
          const username = await fetchUsername(currentUserId);
          messageDiv.innerText = `${username} ${currentTime} ${messageInput.value}`;
        }
        messageDiv.classList.add("message");
        messageDiv.classList.add("framed");
        messageList.appendChild(messageDiv);
        messageInput.value = "";
      }
    })
    .catch((error) => {
      console.error('Error while add message:', error);
    });
}





fetch(api_users_autologin_endpoint, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'token': localStorage.getItem('token')
  }
}).then((response) => {
  return response.json();
}).then((data) => {
  if (data.status === "success") {


    console.log('the login is successful', data);
    let username = data.username;
    currentUserId = data.userId;
    console.log('3 currentUserId:', currentUserId);
    welcomeMessage.textContent = `Welcome ${username}`;

    showRegisterBtn.style.display = 'none';
    showLoginBtn.style.display = 'none';

    channelsForm.style.display = 'block';
    loginForm.style.display = 'none';

    registerForm.style.display = 'none';

    profile.style.display = 'block';

  } else if (data.status === "unauthorised") {
    console.log('401');
  }
  else {
    currentUserId = 0;

  }
});




// const api_users_login_endpoint = "/api/users/login";
loginBtn.addEventListener('click', () => {

  const requestData = {
    username: username.value,
    password: password.value,
  };

  fetch(api_users_login_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        console.log('login  successfully')
        welcomeMessage.textContent = `Welcome ${username.value}`;
        channelsForm.style.display = 'block';
        profile.style.display = 'block';
        registerForm.style.display = 'none';
        loginForm.style.display = 'none';
        showLoginBtn.disabled = true;
        showRegisterBtn.disabled = true;
        currentUserId = data.userId;
        console.log('4 currentUserId:', currentUserId);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        username.value = '';
        password.value = '';
        loginP.textContent = " "
      }
    })
    .catch((error) => {
      loginP.textContent = 'Wrong username or password';
      showRegisterBtn.disabled = false;
      console.error('Error while logging in:', error.message);
    });
});


logoutBtn.addEventListener('click', () => {

  console.log('5 currentUserId:', currentUserId);
  clearMessages();
  currentUserId = 0;
  localStorage.removeItem('token');

  showRegisterBtn.style.display = 'block';
  showLoginBtn.style.display = 'block';

  channelsForm.style.display = 'none';

  profile.style.display = 'none';

  registerForm.style.display = 'none';

  loginForm.style.display = 'block';
  showLoginBtn.disabled = false;
  showRegisterBtn.disabled = false;
});



const api_users_register_endpoint = "/api/users/register";
registerBtn.addEventListener('click', () => {

  const requestData = {
    username: registerUsername.value,
    password: registerPassword.value,
  };
  fetch(api_users_register_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {

        loginForm.style.display = 'none';


        registerForm.style.display = 'block';


        profile.style.display = 'none';
        registerUsername.value = '';
        registerPassword.value = '';
        loginP.textContent = " Registered successfully! Please login."
      } else {
        console.log("User registered failed");
        loginP.textContent = " User registered failed"
      }

    })
    .catch((error) => {
      console.error('Error while registering:', error);
    });
});
//try for create channel but got errors try before summit once