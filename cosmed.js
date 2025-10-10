let cart=[]; //array 陣列
let Item= function(name, price, originPrice, count) {
    this.name=name
    this.price=price
    this.originPrice=originPrice
    this.count=count
};

let currentProd="";
let totalCount=0;
let currCount=1;
let originPrice="";
let prodPrice="";
let page=0;
let current_page=1;

// jQuery
$(function(){
    // 小購物車
    $(".cart").click(function(){
        // console.log("name");
        currentProd=$(this).attr('id');
        prodPrice=$(this).attr('price');
        originPrice=$(this).attr('originalPrice');
        let bg=document.getElementById("bg");
        let element=document.getElementsByClassName("popup-window");
        let name=document.getElementsByClassName("pro_name");
        let price=document.getElementsByClassName("pro_price");
        let oldPrice=document.getElementsByClassName("origin_price");
        element[0].style.display = "block";
        element[0].style.backgroundColor = "white";
        currCount=1;
        // console.log(currCount);
        document.getElementsByClassName("howMany")[0].innerHTML=currCount.toString();
        let pImg=document.getElementById("pro_img");
        showImg="url('img/"+currentProd+".png')";
        // console.log(showImg);
        pImg.style.backgroundImage = showImg;
        pImg.style.backgroundSize = "180px 180px";
        // 取代文字需用innerHTML
        name[0].innerHTML=currentProd; 
        price[0].innerHTML=prodPrice;
        oldPrice[0].innerHTML=originPrice;
        if (originPrice==0){
            $(".pro_price_old").css("display","none");
        }else{
            $(".pro_price_old").css("display","flex");
        }
        bg.style.filter = "blur(5px)";
    });

    // 加入購物車
    $(".add_to_cart").click(function(){
        $(".popup-window").hide();
        $(".add_success").show();
        setTimeout(() => {
            $(".add_success").hide();
          }, 1000);
        
        for (let i in cart){
            if (cart[i].name===currentProd){
                cart[i].count+=currCount;
                saveCart();
                return;
            }
        }
        
        let item=new Item(currentProd, prodPrice, originPrice, currCount);
        cart.push(item);
        saveCart();
        document.getElementById("cart_num").innerHTML=cart.length;
        let bg=document.getElementById("bg");
        bg.style.filter = "none";
    });

    // 加減按鈕
    $(".add-or-minus").click(function(event) {
        // 判斷是此class裡的哪一個屬性
        let button=$(this).attr("isAdd");
        if (button=="1") {
            currCount++;
        } else {
            currCount--;
        }
        document.getElementsByClassName("howMany")[0].innerHTML=currCount;
        // console.log(currCount);
    });

    // 購物車頁面加減按鈕
    $(".cart-add-or-minus").click(function(event){
        let button=$(this).attr("isAdd");
        let index=$(this).attr("value");
        let totalPrice_i=0;
        let totalOldPrice_i=0;
        if (button=="1") {
            cart[index].count++;
        } else {
            cart[index].count--;
        }
        // 同樣的做法可放外側
        let proPricePart_total = cart[index].price*cart[index].count;
        let oldPricePart_total = cart[index].originPrice*cart[index].count;

        // 重複購物車內商品總價
        for (let i in cart){
            totalPrice_i+=cart[i].price*cart[i].count;
            totalOldPrice_i+=cart[i].originPrice*cart[i].count;
        }

        document.getElementsByClassName("howMany")[index].innerHTML = cart[index].count;
        document.getElementsByClassName("pro_price")[index].innerHTML = proPricePart_total;
        document.getElementsByClassName("old_price")[index].innerHTML = oldPricePart_total;
        document.getElementById("show-total-cart").innerHTML = totalOldPrice_i;
        document.getElementById("show-total-price").innerHTML = totalPrice_i;
        document.getElementById("bottom-total-price").innerHTML = totalPrice_i;
        document.getElementById("show-discount").innerHTML = totalOldPrice_i-totalPrice_i;
        saveCart();
    });

    // 點讚按鈕
    $(".like").click(function(){
        let pattern = /\d+/g;
        let text=$(this).attr("id");
        let result = Number(text.match(pattern));
        // console.log(result);
        let element=document.getElementsByClassName("heart");
        let currHeart=element[result].getAttribute('src');
        console.log(currHeart);
        
        if (currHeart=="img/heart.png"){
            element[result].setAttribute("src","img/heart_red.png");
        } else {
            element[result].setAttribute("src","img/heart.png");
        }

    });

    // 取消按鈕
    $(".cancel").click(function(){
        // console.log("window closed");
        let bg=document.getElementById("bg");
        $(".popup-window").hide();
        bg.style.filter = "none";
    });

    // 購物車內商品刪除按鈕
    $(".cancel_cart").click(function(){
        let index=$(this).attr("value");
        cart.splice(index, 1);
        saveCart();
        // console.log(cart);
        displayProduct();
    });

    // 到購物車的哪一頁
    $(".which_page").click(function(){
        let btn=$(this).attr("id");
        if (btn=="go_back"){
            page-=1;
        }else if(btn=="next"){
            page+=1;
        }else{
            page=parseInt(btn)-1;
        }
        
        current_page=parseInt($(this).attr("id"));
        displayProduct();
    });
})

function loadCart(){
    //parse把string改成object
    cart=JSON.parse(localStorage.getItem("cosmedCart")) || [];
}

function saveCart(){
    localStorage.setItem("cosmedCart", JSON.stringify(cart));
}

function bodyCosmed(){
    let bg=document.getElementById("bg");
    $(".popup-window").hide();
    $(".add_success").hide();
    loadCart();
    $("#cart_num").html(cart.length);
    $("#products-chosen").css("display","none");
    bg.style.filter = "none";
}

function bodyInitCart(){
    loadCart();
    displayProduct();
}

function displayCode(){
    $(".downloadCode").css("display","block");
}

function disappearCode(){
    $(".downloadCode").css("display","none");
}

function displayChosen(){
    let output="";
    let currentImg="";
    $("#products-chosen").css("display","block");
    if (cart.length==0){
        output="購物車內沒有商品";
        document.getElementById("products-chosen").innerHTML=output;
        return;
    }
    for (let i in cart){
        currentImg="./img/"+cart[i].name+".png";
        output+=
        "<img src="+currentImg+">"
        +"&emsp;"
        +cart[i].name
        +"<br>"
        +"&emsp;"
        +"&emsp;"
        +"&emsp;"
        +"&emsp;"
        +"NT"+cart[i].price
        +"<br>"
        +"<br>";
        document.getElementById("products-chosen").innerHTML=output;
    }
}

function disappear(){
    $("#products-chosen").css("display","none");
}

function displayProduct(){
    let totalOldPrice=0;
    let totalPrice=0;
    // page_show決定一頁顯示多少項商品
    let page_show=3;
    let pageNum=0;
    $(".cartItem0").css("display","none");
    if(cart.length!=0){
        if (cart.length>page_show){
            $(".pages").css("display","flex");
            let productNumber=cart.length;
            const page_showing=document.getElementsByClassName("which_page");
            
            page_showing[pageNum].style.display="flex";

            // 判斷現在有多少頁，要顯示幾頁
            for (let i=0; i<10; i++){
                page_showing[pageNum+1].style.display="flex";
                productNumber-=page_show;
                pageNum+=1;
                if (productNumber<=0){
                    page_showing[11].style.display="flex";
                    break;
                }
            }
        }else{
            $(".pages").css("display","none");
        }
        $(".nothing").css("display","none");
        $(".discount").css("display","block");
        $(".points").css("display","block");
        $(".totalPrice").css("display","block");
        let cartItem=document.getElementsByClassName("cartItem0");
        const pImg=document.getElementsByClassName("pro_img");
        // console.log("cart=",cart);
        // 將各個購物車分頁產品顯示，一頁僅顯示三個
        for (let i=page*page_show; i<page_show+page*page_show; i++){
            cartItem[i].style.display="block";
            showImg="url('img/"+cart[i].name+".png')";
            pImg[i].style.backgroundImage = showImg;
            pImg[i].style.backgroundSize = "180px 180px";
            // console.log("page:",page, "i:",i);
            document.getElementsByClassName("pro_name")[i].innerHTML = cart[i].name;
            document.getElementsByClassName("old_price")[i].innerHTML = cart[i].originPrice;
            document.getElementsByClassName("pro_price")[i].innerHTML = cart[i].price*cart[i].count;
            document.getElementsByClassName("howMany")[i].innerHTML = cart[i].count;
            // 要是最後一項商品就跳出for迴圈
            if (i==cart.length-1){
                break;
            }
        }

        // 若是已在第一頁，則前一頁按鈕不顯示
        if (page==0){
            document.getElementById("go_back").disabled = true;
        }else{
            document.getElementById("go_back").disabled = false;
        }
        // 若是已在買的商品的最後一頁，則下一頁按鈕不顯示
        if (page==pageNum-1){
            document.getElementById("next").disabled = true;
        }else{
            document.getElementById("next").disabled = false;
        }

        // 計算整個購物車明細
        for (let i in cart){
            totalPrice+=cart[i].price*cart[i].count;
            totalOldPrice+=cart[i].originPrice*cart[i].count;
            // console.log(page);
        }
        document.getElementById("show-total-cart").innerHTML = totalOldPrice;
        document.getElementById("show-total-price").innerHTML = totalPrice;
        document.getElementById("bottom-total-price").innerHTML = totalPrice;
        document.getElementById("show-discount").innerHTML = totalOldPrice-totalPrice;
    } else{
        $(".nothing").css("display","block");
        $(".discount").css("display","none");
        $(".points").css("display","none");
        $(".totalPrice").css("display","none");
    }
}

