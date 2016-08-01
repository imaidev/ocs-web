// JavaScript Document
$(function(){
	//地址信息js
	$(".stepList").delegate("[data-name='adr']:radio","click",function(){$('#adrCon').hide();});
	$("[data-name='newAdr']:radio").click(function(){
		$('#adrCon').show();
		});
	$("[data-name='edit']").click(function(){
	$('#adrCon').show();
	$(this).parent().find('input:radio').prop('checked',true);
		});
	$("[data-name='delete']").click(function(){
	$('#adrCon').hide();
	$(this).parents('ul').find("[data-name='adr']:radio").first().prop('checked',true);
	$(this).parent().remove();
		});
		
	//发票信息js
	
	})
	
	