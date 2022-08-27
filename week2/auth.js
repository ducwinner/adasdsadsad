let userName = document.querySelector("#username");
let password = document.querySelector("#password");
let formMessage = document.querySelector(".form-message");
let fields = document.querySelectorAll(".field");

function resetMessage() {
  Array.from(fields).forEach((e) => {
    e.innerHTML = "";
  });
}

function Validator() {
  // reset message input
  resetMessage();

  if (userName.value === "" || password.value === "") {
    formMessage.innerHTML = "Please enter all fields!";
  } else {
    if (userName.value === "john") {
      if (password.value === "1234") {
        localStorage.setItem("auth", "true");
        window.location.href = "./admin.html";
      } else {
        formMessage.innerHTML = "Please confirm password! it's wrong";
      }
    } else {
      formMessage.innerHTML = "User does not exist! plz check";
    }
  }
}

function isRequired(input) {
  const id = input.getAttribute("id");
  let message = document.querySelector(`.message-${id}`);

  if (!input.value) {
    message.innerHTML = "Please enter this fields!";
    input.style.border = "1px solid rgb(226, 69, 69)";
  } else {
    message.innerHTML = "";
    input.style.border = "1px solid rgb(218, 218, 218)";
  }
}

// Validator.isUserName = (value) => {
//   // check ký tự đặc biệt
//   var regex = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

//   return regex.test(value) ? "Username không hợp lệ" : undefined;
// };

// Validator.isComfirmed = (selector, check) =>  {
//     var input = document.querySelector(`${selector}`).value

//     return input !== check ? `Không tồn tại người dùng` ?
// }
