// import React from 'react'

function Main() {
  return (
    <div className="empty flex flex-col justify-between mt-10">
      {/* use an image */}
      <div className="flex justify-center">
        <img src="/img/2953962.jpg" alt="" className="-intro-x w-1/3 -mt-16" />
      </div>

      {/* use a title */}
      <div className="flex justify-center">
        <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left mt-10">
          No Data Found
        </h2>
      </div>
      {/* use a subtitle */}
    </div>
  )
}

export default Main
