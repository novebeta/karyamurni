import React from 'react';
import './App.css';
class App extends React.Component<{}, { category: string,darker:boolean }>{
 
  constructor(props:any) {
    super(props);
    this.state = {
      category: 'other',
      darker: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  createBoxes() {
    let left = 0;
    let top = 0;
    var elements = document.getElementsByClassName('box');
    while(elements.length > 0){
      if(elements[0].parentNode != null)
        elements[0].parentNode.removeChild(elements[0]);
    }
    // var colors = ["red", "green", "yellow","blue","brown","gray", "purple","pink"];
    // create a for loop and run 40 times;
    for (var i = 1; i < 41; i++) {
      var newDiv = document.createElement("div");
      newDiv.classList.add('box')
      //newDiv.style.backgroundColor = colors[Math.floor(Math.random() * 5)];
      newDiv.style.backgroundColor = "#"+Math.floor(Math.random()*16777215).toString(16);
      newDiv.style.top = top + 'px';
      newDiv.style.left = left + 'px';
      var galery = document.getElementById('galery');
      if(galery != null) galery.append(newDiv);
      left += 70; // increase left 70px each time in the loop
      if (i % 5 === 0) { // if the we have 5 boxes in one row, reset left to 0px and increase top property by 70px to get another row;
        left = 0;
        top += 70;
      }
    }
  }

  filterBox(){
    let boxs = document.getElementsByClassName("box");
    for (var i = 0; i < boxs.length; i++){
      let inner:HTMLElement = boxs.item(i) as HTMLElement;
      if(inner !== null){
        let rgb = inner.style.backgroundColor;
        let arrRGB = rgb.substring(4, rgb.length-1)
         .replace(/ /g, '')
         .split(',');
        let hsl = this.hsl(arrRGB);
        let colorName = this.colorName(hsl);
        let dark = this.inten(arrRGB);
        if(colorName === this.state.category){
          inner.style.display = "none";
        }else{
          if(this.state.darker){
            if(dark === 'dark'){
              inner.style.display = "none";
            }else{
              inner.style.display = "block";
            }               
          }else{
            inner.style.display = "block";
          }
        }    
      }
      
    }
  }

  handleInputChange(event:any) {
    const target = event.target;
    if(target.type === 'checkbox'){
      this.setState({
        darker: target.checked
      },this.filterBox);
    }else{
      this.setState({
        category: target.value
      },this.filterBox);
    }
  }

  hsl(rgbArr:any) {
    var r1 = Number(rgbArr[0]) / 255, g1 = Number(rgbArr[1]) / 255, b1 = Number(rgbArr[2]) / 255;
    var maxColor = Math.max(r1,g1,b1), minColor = Math.min(r1,g1,b1);
    var L = (maxColor + minColor) / 2 , S = 0, H = 0;
    if(maxColor !== minColor){
      if(L < 0.5){
        S = (maxColor - minColor) / (maxColor + minColor);
      }else{
        S = (maxColor - minColor) / (2.0 - maxColor - minColor);
      }
      if(r1 === maxColor){
        H = (g1-b1) / (maxColor - minColor);
      }else if(g1 === maxColor){
        H = 2.0 + (b1 - r1) / (maxColor - minColor);
      }else{
        H = 4.0 + (r1 - g1) / (maxColor - minColor);
      }
    }
    L = L * 100;
    S = S * 100;
    H = H * 60;
    if(H<0){
      H += 360;
    }
    return {h:H, s:S, l:L};
  }

  colorName(hsl:any) {
    var l = Math.floor(hsl.l), s = Math.floor(hsl.s), h = Math.floor(hsl.h);
    if (s <= 10 && l >= 90) {
        return ("White")
    } else if ((s <= 10 && l <= 70) || s === 0) {
        return ("Gray")
    } else if (l <= 15) {
        return ("Black")
    } else if ((h >= 0 && h <= 15) || h >= 346) {
        return ("Red");
    } else if (h >= 16 && h <= 35) {
        if (s < 90) {
            return ("Brown");
        } else {
            return ("Orange");
        }
    } else if (h >= 36 && h <= 54) {
        if (s < 90) {
            return ("Brown");
        } else {
            return ("Yellow");
        }
    } else if (h >= 55 && h <= 165) {
        return ("Green");
    } else if (h >= 166 && h <= 260) {
        return ("Blue")
    } else if (h >= 261 && h <= 290) {
        return ("Purple")
    } else if (h >= 291 && h <= 345) {
        return ("Pink")
    } else{
      return ("Other")
    }
}

inten(rgb:any){
  var hex = "";
  hex += Number(rgb[0]).toString(16); 
  hex += Number(rgb[1]).toString(16); 
  hex += Number(rgb[2]).toString(16); 
  var txt = "";
  var rgbint:any = parseInt(hex, 16);
  var r = (rgbint >> 16) & 0xff; 
  var g = (rgbint >>  8) & 0xff;
  var b = (rgbint >>  0) & 0xff; 
  var inten = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if(inten >= 80 && inten <= 100){
    txt = "semi dark";
  }    else if(inten < 40){
    txt = "dark";
  }    
  else{
    txt = "light";
  }
 return txt;
}

  render(){
    return (
      <div className="App">
      <header className="App-header">
      <div id="galery"> 
      <button onClick={this.createBoxes}>Generate Box</button><br/>
      <label>Category : </label>
      <select name="category" value={this.state.category} onChange={this.handleInputChange}>
        <option value="Other">Other</option>
        <option value="Red">Red</option>
        <option value="Green">Green</option>
        <option value="Yellow">Yellow</option>
        <option value="Blue">Blue</option>
        <option value="Brown">Brown</option>
        <option value="Gray">Gray</option>
        <option value="Purple">Purple</option>
        <option value="Pink">Pink</option>
      </select><br/>
      <label>
          Darker
          <input
            name="darker"
            type="checkbox"
            checked={this.state.darker}
            onChange={this.handleInputChange} />
        </label>
      </div>
      </header>
    </div>
    );
  }
}

export default App;
