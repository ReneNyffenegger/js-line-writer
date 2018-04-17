"use strict";

var tq84 = tq84 || {};

// tq84.line_writer = {};
tq84.line_writer = function(canvas_div, width_out, opts) {

    this.canvas_div = canvas_div;

    this.body  = document.getElementsByTagName('body')[0];

    if (typeof(opts) === 'undefined') {
      opts={};
    }

    this.left_to_right     = opts.left_to_right === undefined ? true : opts.left_to_right;
    this.gap_x_px          = opts.gap_x_px      === undefined ?   15 : opts.gap_x_px;
    this.gap_y_px          = opts.gap_y_px      === undefined ?   20 : opts.gap_y_px;
    let  start_from_top_px = opts.border_x_px   === undefined ?   20 : opts.start_from_top_px;

 //
 // Convert the given width (which can be specified with units such as
 //'cm'or 'in' to pixels:
 //
    this.width_out_px = this.calculate_width_px(width_out);

    this.cur_pos_x_px = 0;
    this.cur_pos_y_px = start_from_top_px;
}


tq84.line_writer.prototype.emit = function (html_texts) {

  var max_line_height_px = 0;

  html_texts.map(function(html_text) {
  
    var w=document.createElement(null);

    w.style.position   = 'absolute';
    w.style.visibility = 'hidden';
    w.innerHTML = html_text;

    this.canvas_div.appendChild(w);
  
    var html_text_width_px  = w.clientWidth;
    var html_text_height_px = w.clientHeight;

    let new_line = false;

    if (this.cur_pos_x_px + html_text_width_px > this.width_out_px ) { // New line?
       this.cur_pos_y_px += max_line_height_px + this.gap_y_px;
       this.cur_pos_x_px  = 0;
       max_line_height_px = html_text_height_px; // w.clientHeight;
       new_line = true;
    }
    
    if (this.left_to_right) {
      w.style.left = this.cur_pos_x_px + "px";
    }
    else {
      w.style.right = this.cur_pos_x_px + "px";
    }
    w.style.top  = this.cur_pos_y_px + "px";
  
    this.cur_pos_x_px += html_text_width_px + this.gap_x_px;
    if (! new_line) {
      if (max_line_height_px < html_text_height_px) {
         max_line_height_px = html_text_height_px;
      }
    }
    w.style.visibility = 'visible';
  
  }, this);


  return {
    height_px: this.cur_pos_y_px + max_line_height_px
  };
}

tq84.line_writer.prototype.calculate_width_px = function(width_out) {

  var div_ = document.createElement('div');
  this.body.appendChild(div_);
  div_.style.width = width_out;
  var width_px   = div_.clientWidth;
  this.body.removeChild(div_);

  return width_px;

}
