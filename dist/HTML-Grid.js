/*
 * HTML-Grid version 1.1.0-beta
 */
/*****************************/
//---> Create	:	1396.04.25
//---> Finish	:	1396.04.27
//---> Update	:	1396.05.14
/*****************************/
$(document).ready(function () {
	if ($('.html-grid').length > 0) {
		erkinGrid = new class_erkinGrid();
	}
});

function class_erkinGrid () {
	/*
	 * master class is : "html-grid"
	 * child class is : "grid-item"
	 * ==============================
	 * usage example :
	 * <div class="html-grid" data-gap="15" data-minwidth="250">
	 *     <div class="grid-item">grid item 1</div>
	 *     <div class="grid-item">grid item 2</div>
	 *     <div class="grid-item">grid item 3</div>
	 *     <div class="grid-item">grid item 4</div>
	 *     <div class="grid-item">grid item 5</div>
	 * </div>
	 * ==============================
	 * this script works fine if columns have equal width;
	 */
	
	var self = this;
	
	/*****************************/
	
	this.init = function() {
		self.handler();
		
		$.each($('.html-grid'), function(index, grid_master) {
			self.sort(grid_master);
		});
	};
	
	/*****************************/
	
	this.timeout = '';
	
	/*****************************/
	
	this.handler = function() {
		$(window).resize(function() {
			clearTimeout(self.timeout);
			self.timeout = setTimeout(self.init, 500);
		});
	};
	
	/*****************************/
	
	// for each grid_master separately :
	this.sort = function(grid_master) {
		// get data configs :
		var gap = $(grid_master).data('gap');               gap = parseInt(gap);
		var minWidth = $(grid_master).data('minwidth');     minWidth = parseInt(minWidth);
		
		// set default styles :
		var data = self.setStyles(grid_master, gap, minWidth);
		//data.gap = gap;
		
		// main job -> grid nicely :
		self.grid(grid_master, data);
	};
	
	this.setStyles = function(grid_master, gap, minWidth) {
		
		// guess columns-count :
		var master_width = $(grid_master).width();
		var columns_count = 1;
		var temp = minWidth + gap;
		while (temp + minWidth + gap < master_width) {
			temp = temp + minWidth + gap;
			columns_count++;
		}
		
		// get item's width :
		var item_width = (master_width - (columns_count - 1) * gap) / columns_count;
		item_width = Math.round(item_width);
		
		// set default style to master :
		$(grid_master).css({
			"display" : "block",
			"overflow" : "visible"
		});
		
		// set default style to all child items :
		$(grid_master).find('.grid-item').css({
			"display" : "block",
			"float" : "none",
			"position" : "absolute",
			"margin" : "0",
			"width" : item_width + "px"
		});
		
		return {
			"master_width": master_width,
			"columns_count": columns_count,
			"item_width": item_width,
			"gap": gap
		};
	};
	
	this.grid = function(grid_master, data) {
		// data example : data = {master_width: 893, columns_count: 3, item_width: 287.6666666666667, gap: 15}
		
		// get grid items count :
		data.grid_items_count = $(grid_master).find('.grid-item').length; //ok;
		
		// for future reference :
		var column_height = []; // 0 as col1, 1 as col2, 2 as col3, ...
		for (var i = 0; i < data.columns_count; i++) {
			column_height.push(0);
		}
		
		// for each grid-item :
		for (var i = 0; i < data.grid_items_count; i++) {
			var this_item = $(grid_master).find('.grid-item')[i];
			
			// get shortest column number :
			var itemColumnNumber = column_height.indexOf(arrayMin(column_height)) + 1;
			
			// set css :
			$(this_item).css({
				"top": column_height[itemColumnNumber - 1] + "px",
				"right": (itemColumnNumber - 1) * (data.item_width + data.gap) + "px"
			});
			
			// increase height :
			column_height[itemColumnNumber - 1] += $(this_item).height() + data.gap;
		}
		
		// set min-height for grid_master :
		var max_height = arrayMax(column_height);
		$(grid_master).css({
			"padding-top": max_height + "px"
		});
	};
	
	/*****************************/
	// After All Methods :
	var __construct = function(that) {
		that.init();
	}(self)
}
