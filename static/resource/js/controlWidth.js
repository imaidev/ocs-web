function change_choose_product_many_list_width(){
	   var widths=document.getElementById("choose-product-many-list");
	   var childNode = document.getElementById("many-select").childNodes;
	   var FirstChildNum=(childNode.length-1)/2;//第一层子节个点数;
	   var setWidth = 333*FirstChildNum;
	   var setEndWidth = setWidth+"px";
	   widths.style.width=setEndWidth;
   }