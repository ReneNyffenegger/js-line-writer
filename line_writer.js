"use strict";

var tq84 = tq84 || {};

// tq84.line_writer = {};
tq84.line_writer = function(canvas_div, width_out, opts) {

    this.canvas_div = canvas_div;

    if (typeof(opts) === 'undefined') {
      opts={};
    }

    this.left_to_right      = opts.left_to_right === undefined ? true : opts.left_to_right;
    this.gap_x_px           = opts.gap_x_px      === undefined ?   15 : opts.gap_x_px;
    this.gap_y_px           = opts.gap_y_px      === undefined ?   20 : opts.gap_y_px;
    let  start_from_top_px  = opts.border_x_px   === undefined ?   20 : opts.start_from_top_px;
    this.start_from_side_px = opts.border_x_px   === undefined ?   20 : opts.start_from_side_px;

 //
 // Convert the given width (which can be specified with units such as
 //'cm'or 'in' to pixels:
 //
    this.width_out_px = this.calculate_width_px(width_out);

    this.cur_pos_x_px = this.start_from_side_px;
    this.cur_pos_y_px = start_from_top_px;

    this.max_line_height_px = 0;
}

tq84.line_writer.prototype.emit = function (html_text) {
  
    var w=document.createElement(null);

    w.style.position   = 'absolute';
    w.style.visibility = 'hidden';
    w.innerHTML = html_text;

    this.canvas_div.appendChild(w);
  
    var html_text_width_px  = w.clientWidth;
    var html_text_height_px = w.clientHeight;

    let start_new_line = false;

    if (this.cur_pos_x_px + html_text_width_px > this.width_out_px ) { // New line?
       this.new_line();
//     this.cur_pos_y_px += this.max_line_height_px + this.gap_y_px;
//     this.cur_pos_x_px = this.start_from_side_px;
       this.max_line_height_px = html_text_height_px; // w.clientHeight;
       start_new_line = true;
    }
    
    if (this.left_to_right) {
      w.style.left = this.cur_pos_x_px + "px";
    }
    else {
      w.style.right = this.cur_pos_x_px + "px";
    }
    w.style.top  = this.cur_pos_y_px + "px";
  
    this.cur_pos_x_px += html_text_width_px + this.gap_x_px;
    if (! start_new_line) {
      if (this.max_line_height_px < html_text_height_px) {
         this.max_line_height_px = html_text_height_px;
      }
    }
    w.style.visibility = 'visible';

}

tq84.line_writer.prototype.new_line = function() {
    this.cur_pos_y_px += this.max_line_height_px + this.gap_y_px;
    this.cur_pos_x_px = this.start_from_side_px;
//  this.max_line_height_px = html_text_height_px;
}

tq84.line_writer.prototype.height = function() {

  return this.cur_pos_y_px + this.max_line_height_px;

}

tq84.line_writer.prototype.calculate_width_px = function(width_out) {

  var div_ = document.createElement('div');
  document.body.appendChild(div_);

  div_.style.width = width_out;
  var width_px   = div_.clientWidth;

  document.body.removeChild(div_);

  return width_px;
}
