// @flow
import React from 'react';
// import { Route } from 'react-router-dom';

// click and drag derived from https://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable

class PatchNodeView extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClickForDrag = this.handleClickForDrag.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.renderDeleteButton = this.renderDeleteButton.bind(this);
    this.classNames = this.classNames.bind(this);
    this.state = {
      dragging: false,
      relative: {
        x: 0,
        y: 0
      } // position relative to the cursor
    };
  }

  componentDidUpdate() {
    if (this.state.dragging) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    } else if (!this.state.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  handleClickForDrag(event) {
    if (event.button !== 0) return;
    document.body.style.cursor = '-webkit-grabbing';
    var position = {
      x: this.refs.patchNode.offsetLeft,
      y: this.refs.patchNode.offsetTop
    };
    console.log(
      '\n\n\n\n\n||||||||||| START CLICK |||||||||||||\n',
      '\nposition from offset\n',
      {
        x: this.refs.patchNode.offsetLeft,
        y: this.refs.patchNode.offsetTop
      },
      '\nSTATE POSITION \n',
      { x: this.props.xPos, y: this.props.yPos },
      '\nSTATE RELATIVE\n',
      this.state.relative
    );
    this.setState({
      dragging: true,
      relative: {
        x: event.pageX - this.props.xPos,
        y: event.pageY - this.props.yPos
      }
    });
    event.stopPropagation();
    event.preventDefault();
  }

  onMouseMove(event) {
    console.log(
      '\n\n\n>>> EVENT POSITION >>\n',
      { x: event.pageX, y: event.pageY },
      '\nSTATE POSITION \n',
      { x: this.props.xPos, y: this.props.yPos },
      '\nSTATE RELATIVE\n',
      this.state.relative
    );
    if (!this.state.dragging) return;
    // this.setState({
    //   position: {
    //     x: event.pageX - this.state.relative.x,
    //     y: event.pageY - this.state.relative.y
    //   }
    // });
    this.props.updatePosition(this.props.patchId, {
      x: event.pageX - this.state.relative.x,
      y: event.pageY - this.state.relative.y
    });
    event.stopPropagation();
    event.preventDefault();
  }

  onMouseUp(event) {
    this.setState({ dragging: false });
    this.props.updatePosition(this.props.patchId, {
      x: 20 * Math.round(this.props.xPos / 20),
      y: 20 * Math.round(this.props.yPos / 20)
    });
    // this.props.updatePosition(this.props.patchId, {
    //   x: Math.ceil((this.props.xPos + 1) / 20) * 20,
    //   y: Math.ceil((this.props.yPos + 1) / 20) * 20
    // });
    // Math.ceil((N+1) / 10) * 10;
    document.body.style.cursor = 'inherit';
    event.stopPropagation();
    event.preventDefault();
  }

  handleKeyPress(target) {
    if (target.charCode == 13) {
      this.props.openPatchEdit();
    }
  }

  renderDeleteButton() {
    return (
      <a
        className="delete-button"
        onClick={event => {
          event.stopPropagation();
          this.props.deletePatch();
        }}
      >
        delete
      </a>
    );
  }

  classNames() {
    let classes = ['patch-node'];
    if (this.state.dragging) classes.push('dragging');
    return classes.join(' ');
  }

  render() {
    // if (this.state.dragging) {
    //   document.body.style.cursor = '-webkit-grabbing'; // only safe because Electron is webkit
    // } else {
    //   document.body.style.cursor = 'inherit';
    // }
    //onClick={this.props.openPatchEdit}
    return (
      <div
        className={this.classNames()}
        id={`patch-node-${this.props.patchId}`}
        ref={`patchNode`}
        onKeyPress={this.handleKeyPress}
        onMouseDown={event => {
          this.handleClickForDrag(event);
        }}
        style={{
          top: `${this.props.yPos / 10}rem`,
          left: `${this.props.xPos / 10}rem`
        }}
        tabIndex="2"
      >
        <div className="patch-node-wrapper">
          <header>
            <h4 className="patch-title">{this.props.name}</h4>
          </header>
          <section className="patch-body">
            {this.props.body}
          </section>
          <footer className="patch-footer">
            <span className="patch-id">patch id: {this.props.patchId}</span>
            {this.renderDeleteButton()}
          </footer>
        </div>
      </div>
    );
  }
}

/*
TODO: propTypes is deprecated,
consult docs for updated library
 */
// Patch.propTypes = {
//   id: React.PropTypes.string.isRequired,
//   name: React.PropTypes.string.isRequired,
//   body: React.PropTypes.string.isRequired
// };

export default PatchNodeView;