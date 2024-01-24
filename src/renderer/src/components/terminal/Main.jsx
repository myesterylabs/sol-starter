import "./terminal-styles.css";

// import { enter, leave, linkTo, toggleMobileMenu } from "./index";
import { useEffect, useState } from "react";

function Main(props) {
  return (
    <>
      <div className='terminal space shadow'>
        <div className='top'>
          <div className='btns'></div>
          {/* <div className='title'>bash -- 70x32</div> */}
        </div>
        <pre className='body'>{props.body}</pre>
      </div>
    </>
  );
}

export default Main;
