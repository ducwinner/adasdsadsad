import styles from "./style.module.css";
import classnames from "classnames/bind";

const cx = classnames.bind(styles);
function Button({ text, onClick, typeSearch }) {
  return (
    <button
      className={cx("button-submit", typeSearch ? "search" : "")}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
