import styles from "./style.module.css";
import classnames from "classnames/bind";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const cx = classnames.bind(styles);

function Pagigation({ dataLength, rowOfTable, currentPage, onPageClick }) {
  let amountPage = Math.ceil(dataLength / rowOfTable);
  let arrRender = [];

  console.log(currentPage);
  console.log(amountPage);
  const listPageRender = () => {
    if (currentPage <= 5) {
      for (let i = 1; i <= 5; i++) {
        arrRender.push(i);
      }
    } else if (currentPage <= amountPage - 2) {
      for (let i = -2; i <= 2; i++) {
        if (i > currentPage - 2 || i < currentPage + 2) {
          arrRender.push(i + currentPage);
        }
      }
    } else {
      for (let i = 4; i >= 0; i--) {
        arrRender.push(amountPage - i);
      }
    }
  };

  listPageRender();

  return (
    <div className={cx("pagigation")}>
      <FontAwesomeIcon
        onClick={(e) => {
          onPageClick(e, "prev");
        }}
        icon={faAngleLeft}
        className={cx("next-prev")}
      />
      {arrRender.map((e, index) => {
        if (currentPage == e) {
          return (
            <div
              onClick={(e) => {
                onPageClick(e, "this");
              }}
              key={index}
              className={cx("pagigation-item", "active2")}
            >
              {e}
            </div>
          );
        } else {
          return (
            <div
              onClick={(e) => {
                onPageClick(e, "this");
              }}
              key={index}
              className={cx("pagigation-item")}
            >
              {e}
            </div>
          );
        }
      })}
      <FontAwesomeIcon
        onClick={(e) => {
          onPageClick(e, "next");
        }}
        icon={faAngleRight}
        className={cx("next-prev")}
      />
    </div>
  );
}

export default Pagigation;
