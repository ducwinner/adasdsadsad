function Validator() {
  let userName = document.querySelector("#username");
  let password = document.querySelector("#password");
  let formMessage = document.querySelector(".form-message");

  if (userName.value === "" || password.value === "") {
    formMessage.innerHTML = "Please enter all fields!";
  } else {
    if (userName.value === "join") {
      if (password.value === "1234") {
        window.location.href = "./admin.html";
      } else {
        formMessage.innerHTML = "Please confirm password! it's wrong";
      }
    } else {
      formMessage.innerHTML = "User does not exist! plz check";
    }
  }
}

function isRequired(t) {
  const id = t.getAttribute("id");
  let message = document.querySelector(`.message-${id}`);

  if (!t.value) {
    message.innerHTML = "Please enter this fields!";
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
