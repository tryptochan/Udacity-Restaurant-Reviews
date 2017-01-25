/* eslint-disable */
import React, { Component, PropTypes } from 'react'

const parentStyles = {
  overflow: 'hidden',
  position: 'relative'
}

const defaultStyles = {
  position: 'relative',
  overflow: 'hidden',
  display:  'block',
  float:    'left'
}

const hidden = {
  position: 'absolute',
  left: -10000,
  top: 'auto',
}

const getHalfStarStyles = (color, uniqueness) => {
  return `
    .react-stars-${uniqueness}:before {
      position: absolute;
      overflow: hidden;
      display: block;
      z-index: 1;
      top: 0; left: 0;
      width: 50%;
      content: attr(data-forhalf);
      color: ${color};
  }`
}

class ReactStars extends Component {

  constructor(props) {

    super(props)

    // set defaults

    props = Object.assign({}, props)

    if(typeof props.edit === 'undefined') {
      props.edit = true
    }

    if(typeof props.half === 'undefined') {
      props.half = true
    }

    this.state = {
      uniqueness: (Math.random() + '').replace('.', ''),
      value: props.value || 0,
      stars: [],
      halfStar: {
        at: Math.floor(props.value),
        hidden: props.half && props.value % 1 < 0.5
      }
    }

    this.state.config = {
      count:  props.count || 5,
      size:   props.size || 15,
      char:   props.char || '★',
      // default color of inactive star
      color1: props.color1 || 'gray',
      // color of an active star
      color2: props.color2 || '#ffd700',
      half:   props.half,
      edit:   props.edit,
    }

  }

  componentDidMount() {
    this.setState({
      stars: this.getStars(this.state.value)
    })
  }

  componentWillReceiveProps(props) {
    this.setState({
      stars: this.getStars(props.value),
      value: props.value,
      halfStar: {
        at: Math.floor(props.value),
        hidden: this.state.config.half && props.value % 1 < 0.5
      }
    })
  }

  isDecimal(value) {
    return value % 1 !== 0
  }

  getRate() {
    let stars
    if(this.state.config.half) {
      stars = Math.floor(this.state.value)
    } else {
      stars = Math.round(this.state.value)
    }
    return stars
  }

  getStars(activeCount) {
    if(typeof activeCount === 'undefined') {
      activeCount = this.getRate()
    }
    let stars = []
    for(let i = 0; i < this.state.config.count; i++) {
      stars.push({
        active: i <= activeCount - 1
      })
    }
    return stars
  }

  mouseOver(event) {
    let { config, halfStar } = this.state
    if(!config.edit) return;
    let index = Number(event.target.getAttribute('data-index'))
    if(config.half) {
      const isAtHalf = this.moreThanHalf(event, config.size)
      halfStar.hidden = isAtHalf
      if(isAtHalf) index = index + 1
      halfStar.at = index
    } else {
      index = index + 1
    }
    this.setState({
      stars: this.getStars(index)
    })
  }

  moreThanHalf(event, size) {
    let { target } = event
    var mouseAt = event.clientX - target.getBoundingClientRect().left
    mouseAt = Math.round(Math.abs(mouseAt))
    return mouseAt > size / 2
  }

  mouseLeave() {
    const { value, halfStar, config } = this.state
    if(!config.edit) return
    if(config.half) {
      halfStar.hidden = !this.isDecimal(value)
      halfStar.at = Math.floor(this.state.value)
    }
    this.setState({
      stars: this.getStars()
    })
  }

  clicked(event) {
    const { config, halfStar } = this.state
    if(!config.edit) return
    let index = Number(event.target.getAttribute('data-index'))
    let value
    if(config.half) {
      const isAtHalf = this.moreThanHalf(event, config.size)
      halfStar.hidden = isAtHalf
      if(isAtHalf) index = index + 1
      value = isAtHalf ? index : index + .5
      halfStar.at = index
    } else {
      value = index = index + 1
    }
    this.setState({
      value: value,
      stars: this.getStars(index)
    })
    this.props.onChange(value)
  }

  handleKeyDown(event) {
    if (!this.state.config.edit) return;
    if ([37, 38, 39, 40].indexOf(event.keyCode) === -1) return;
    let value;
    if (event.keyCode === 39 || event.keyCode === 38) {
      value = Math.min(this.state.config.count, this.state.value+1)
    } else if (event.keyCode === 37 || event.keyCode === 40) {
      value = Math.max(0, this.state.value-1) 
    }
    this.setState({
      stars: this.getStars(value),
      value: value
    });
    event.preventDefault();
  }

  renderHalfStarStyleElement() {
    const { config, uniqueness } = this.state
    return (
      <style dangerouslySetInnerHTML={{
        __html: getHalfStarStyles(config.color2, uniqueness)
      }}></style>
    )
  }

  renderStars() {
    const { halfStar, stars, uniqueness } = this.state
    const { color1, color2, size, char, half, edit } = this.state.config
    return stars.map((star, i) => {
      let starClass = ''
      if(half && !halfStar.hidden && halfStar.at === i) {
        starClass = `react-stars-${uniqueness}`
      }
      const style = Object.assign({}, defaultStyles, {
        color:    star.active ? color2 : color1,
        cursor: edit ? 'pointer' : 'default',
        fontSize: `${size}px`
      })
      return (
        <span
          className={starClass}
          style={style}
          key={i}
          role="presentation"
          aria-hidden={true}
          data-index={i}
          data-forhalf={char}
          onMouseOver={this.mouseOver.bind(this)}
          onMouseMove={this.mouseOver.bind(this)}
          onMouseLeave={this.mouseLeave.bind(this)}
          onClick={this.clicked.bind(this)}>
          {char}
        </span>
      )
    })
  }

  render() {

    const {
      className
    } = this.props

    return (
      <div className={className} style={parentStyles}
          tabIndex={this.state.config.edit ? 0 : -1}
          onKeyDown={this.handleKeyDown.bind(this)}
          role="presentation"
          aria-describedby={'star-description-'+this.state.uniqueness}
      >
        <p style={hidden}
          id={'star-description-'+this.state.uniqueness}
          aria-live={this.state.config.edit ? 'polite' : 'off'}
          aria-atomic={true}
        >
           {this.state.value} {this.state.value === 1 ? 'star' : 'stars'} rating</p>
        {this.state.config.half ?
        this.renderHalfStarStyleElement() : ''}
        {this.renderStars()}
      </div>
    )
  }

}

ReactStars.propTypes = {
  className: PropTypes.string,
  edit: PropTypes.bool,
  half: PropTypes.bool,
  value: PropTypes.number,
  count: PropTypes.number,
  char: PropTypes.string,
  size: PropTypes.number,
  color1: PropTypes.string,
  color2: PropTypes.string
}

export default ReactStars
