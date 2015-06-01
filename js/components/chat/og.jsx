import React from "react";

export default class OG extends React.Component {

  render() {
    let og = this.props.params;
    if(!(og.title || og.image || og.description)) {
      return <div></div>;
    }
    let img;
    if(og.image) {
      if(!og.image.match(/^https?:/)) {
        og.image = location.protocol + "//" + og.image.replace(/^\/\//, '');
      }
      img = <a href={og.link} target="_blank" className="b-og--photo">
          <img src={og.image} alt={og.title}/>
        </a>;
    }
    return (
      <div className="b-og">
        {img}
        <div className="b-og--info">
          <a className="b-og--title" target="_blank" href={og.link}>{og.title}</a>
          <p>{og.description}</p>
        </div>
      </div>
    );
  }

}
