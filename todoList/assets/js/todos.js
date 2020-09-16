$("ul").on("click","li", function(){
    $(this).toggleClass("completed");
});

$("ul").on("click","span",function(event){
    event.stopPropagation();
    $(this).parent().fadeOut(function(){
        $(this).remove();
    });
});


$("input[type='text']").keypress(function(e){
    if(e.which=== 13){
        var newTodo = $(this).val();
        $(this).val("");
        $("ul").append( "<li> <span><i id=\"trash\" class=\"fas fa-trash-alt\"></i> </span>"+newTodo+"</li>");
    }
});

$(".fa-plus-square").on("click", function(){
    $("input[type='text']").fadeToggle(100);
});