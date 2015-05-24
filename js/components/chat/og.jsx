import React from "react";

export default class OG extends React.Component {

  render() {
    let og = this.props.params;
    return (
      <div className="b-og">
        <a href={og.link} target="_blank" className="b-og--photo">
          <img src={og.image} alt={og.title}/>
        </a>
        <div className="b-og--info">
          <a className="b-og--title" target="_blank" href={og.link}>{og.title}</a>
          <p>{og.description}</p>
        </div>
      </div>
    );
  }

}
