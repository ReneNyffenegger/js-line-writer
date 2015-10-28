"use strict";

var tq84 = tq84 || {};

tq84.line_writer = {};

tq84.line_writer.init = function(
    canvas_div,
    width_out, // use units: '21cm'
    opts
) {

  this.canvas_div = canvas_div;

  this.body  = document.getElementsByTagName('body')[0];


  if (typeof (opts.left_to_right) === 'undefined') {
    this.left_to_right = true;
  }
  else {
    this.left_to_right = opts.left_to_right;
  }


  this.width_out_px = this.calculate_width_px(width_out);
}

tq84.line_writer.emit = function (start_line_px, html_texts /* words */) {

  var gap_x_px  = 15;
  var gap_y_px  = 20;

  var cur_pos_y_px = start_line_px;
  var cur_pos_x_px = 0;

  var max_line_height_px = 0;
  html_texts.map(function(html_text) {
  
    var w=document.createElement(null);
    w.style.position   = 'absolute';
    w.style.visibility = 'hidden';
    w.innerHTML = html_text;
    this.canvas_div.appendChild(w);
  
    var html_text_width_px = w.clientWidth;
  
    if (this.left_to_right) {
      w.style.left = cur_pos_x_px + "px";
    }
    else {
      w.style.right = cur_pos_x_px + "px";
    }
    w.style.top  = cur_pos_y_px + "px";
  
  
    if (cur_pos_x_px + html_text_width_px > this.width_out_px ) { // New line?
       cur_pos_y_px += max_line_height_px + gap_y_px;
       cur_pos_x_px  = 0;
       max_line_height_px = w.clientHeight;
    }
    else {
      cur_pos_x_px += html_text_width_px + gap_x_px;
      if (max_line_height_px < w.clientHeight) {
         max_line_height_px = w.clientHeight;
      }
    }
  
  
     w.style.visibility = 'visible';
  
  }, this);


  return {
    height_px: cur_pos_y_px + max_line_height_px
  };
}

tq84.line_writer.calculate_width_px = function(width_out) {

  var div_ = document.createElement('div');
  this.body.appendChild(div_);
  div_.style.width = width_out;
  var width_px   = div_.clientWidth;
  this.body.removeChild(div_);

  return width_px;

}

