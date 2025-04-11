$(document).ready(function () {
  // ------------ Announcement Slider ------------

  $(".ann-slider").slick({
    vertical: true,
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  });

  // --------------------------------------------------------
  // --------------------------------------------------------

  // ------------ Product Quantity ------------

  let qty_input = $(".quantity-selector__input");
  let qty_increase_btn = $("[data-action='increase']");
  let qty_decrease_btn = $("[data-action='decrease']");
  let qty_input_value = 1;
  let min_qty = 1;
  let max_qty = qty_input.attr("max");

  qty_increase_btn.click(function () {
    increase_qty();
  });

  qty_decrease_btn.click(function () {
    decrease_qty();
  });

  function increase_qty() {
    qty_input_value = Number(qty_input.val());

    if (!(qty_input_value >= max_qty)) {
      qty_input.val(qty_input_value + 1);
    }

    disable_increase();
    disable_decrease();
  }

  function disable_increase() {
    qty_input_value = Number(qty_input.val());

    if (qty_input_value == max_qty) {
      qty_increase_btn.addClass("qty_disabled");
      qty_increase_btn.attr("disabled", "disabled");
    } else {
      qty_increase_btn.removeClass("qty_disabled");
      qty_increase_btn.removeAttr("disabled");
    }
  }

  function decrease_qty() {
    qty_input_value = Number(qty_input.val());

    if (!(qty_input_value <= min_qty)) {
      qty_input.val(qty_input_value - 1);
    }

    disable_decrease();
    disable_increase();
  }

  function disable_decrease() {
    qty_input_value = Number(qty_input.val());

    if (qty_input_value > min_qty) {
      qty_decrease_btn.removeClass("qty_disabled");
      qty_decrease_btn.removeAttr("disabled");
    } else {
      qty_decrease_btn.addClass("qty_disabled");
      qty_decrease_btn.attr("disabled", "disabled");
    }
  }

  // --------------------------------------------------------
  // --------------------------------------------------------

  // ------------ Product ------------

  let main_image = $(".main-image img");
  let product_name = $(".product-name");
  let price = $(".price-highlight");
  let old_price = $(".price-compare");
  let review_count = $(".rating-caption");
  let size_list = $(".block-swatch-list");
  let size_radio = $(".block-swatch__radio");
  let size_lable = $("#size-label");
  let color_list = $(".color-swatch-list");
  let color_lable = $("#color-label");

  let product_images, product_varients, checked_varient, selected_size;

  $.getJSON("assets/products.json", function (productData) {
    product_name.text(productData.product_name);
    price.text("$" + productData.price);
    old_price.text(productData.old_price);
    review_count.text(productData.review_count + " reviews");
  
    product_varients = productData.varients;
    checked_varient = product_varients.snow_white;
    product_images = checked_varient.images;

    show_product_images();
    show_product_color();
    color_lable.text(checked_varient.varient_name);

    show_product_sizes();
    selected_size = $(".block-swatch__radio:checked").attr("value");
    size_lable.text(selected_size);

    image_zoom();
    show_buttons();

    //  -------- Change Varient --------
    $(".color-swatch__radio").on("change", function () {
      checked_varient = productData.varients[$(this).attr("value")];
      product_images = checked_varient.images;
      color_lable.text(checked_varient.varient_name);
      show_product_images();
      show_product_sizes();
      image_zoom();

      $(".block-swatch__radio").on("change", function () {
        show_buttons();
      });

      show_buttons();
    });

    //  -------- Change Size --------
    $(".block-swatch__radio").on("change", function () {
      show_buttons();
    });

    //  -------- Add to cart --------

    $(".add_to_cart").on("click", function(e){
      e.preventDefault();
      $("#cart-form").submit();
    });

    $("#cart-form").submit(function(e){
      e.preventDefault();
      let cart_count = $(".cart-count");
      let prod_name = productData.product_name;
      let prod_price = productData.price;
      
      let prod_color = $(".color-swatch__radio:checked").val();
      let prod_size = $(".block-swatch__radio:checked").val();
      let prod_qty = parseInt($("#qty").val());
      let prod_img =  productData.varients[prod_color].images[0];

      if(prod_qty > productData.varients[prod_color].sizes[prod_size]) {
        alert("Select valid quantity!");
        return;
      }

      let total_price = prod_price * prod_qty;
      
      $("#prod-img").attr("src", prod_img);
      $("#prod_name").text(prod_name);
      $("#prod_price").text("Price: $" + prod_price);
      $("#prod_color").text("Color: " + prod_color);
      $("#prod_size").text("Size: " +prod_size);
      $("#prod_qty").text("Qty.: " + prod_qty);
      $("#prod_total").text("Total:   $" + total_price);
      cart_count.text(parseInt(cart_count.text())+1);
      
      $("#myModal").delay("fast").fadeIn();
      setTimeout("$('#myModal').fadeOut(); ", 5000);

    });

    $(".close").on("click", function() {
      $("#myModal").css("display", "none");
    });

    $(".modal").on("click", function() {
      $("#myModal").css("display", "none");
    });


    //  -------- Show Image Fuction --------
    function show_product_images() {
      main_image.attr({
        src: product_images[0],
        "data-magnify-src": product_images[0],
      });

      for (let index = 0; index < product_images.length; index++) {
        if (index == 0) {
          $(".thumbnails").html(
            "<div class='thumb'><img src='" +
              product_images[index] +
              "' class='active' alt='thumb-" +
              (index + 1) +
              "' /></div>"
          );
        } else {
          $(".thumbnails").append(
            "<div class='thumb'><img src='" +
              product_images[index] +
              "' alt='thumb-" +
              (index + 1) +
              "' /></div>"
          );
        }
      }

      // ------- Main Image Change ------
      $(".thumb").click(function () {
        let thumb = $(this).children().attr("src");
        $(".thumb").children().removeClass("active");
        $(this).children().addClass("active");
        $(".zoomWindow").css("background-image", `url(${thumb})`);

        main_image
          .fadeTo(200, 0.25, function () {
            $(this).attr("src", thumb);

            $(this).attr("data-magnify-src", thumb);
          })
          .fadeTo(200, 1);
      });
    }

    //  -------- Show Colors Fuction --------
    function show_product_color() {
      product_varients = Object.values(productData.varients);

      for (let index = 0; index < product_varients.length; index++) {
        if (index == 0) {
          color_list.html(
            `<div class='color-swatch'><input class='color-swatch__radio visually-hidden' type='radio' id='${
              product_varients[index]["id"]
            }' value='${
              product_varients[index]["id"]
            }' name='color_radio' form="cart-form" checked /> <label class='color-swatch__item' for='${
              product_varients[index]["id"]
            }' style='background-color: ${
              product_varients[index]["color"]
            }'> <span class='visually-hidden'>${product_varients[index]["varient_name"]}</span> </label> </div>`
          );
        } else {
          color_list.append(
            `<div class='color-swatch'><input class='color-swatch__radio visually-hidden' type='radio' id='${product_varients[index]["id"]}' value='${product_varients[index]["id"]}' name='color_radio' form="cart-form"/> <label class='color-swatch__item' for='${product_varients[index]["id"]}' style='background-color: ${product_varients[index]["color"]}' > <span class='visually-hidden'>${product_varients[index]["varient_name"]}</span> </label> </div>`
          );
        }
      }
    }

    //  -------- Show Sizes Fuction --------
    function show_product_sizes() {
      let checked_available_size = Object.keys(checked_varient.sizes);

      let checked_available_size_qty = Object.values(checked_varient.sizes);

      for (let index = 0; index < checked_available_size.length; index++) {
        let is_disabled = "";

        if (checked_available_size_qty[index] == 0) {
          is_disabled = "is-disabled";
        }

        if (index == 0) {
          size_list.html(
            `<div class="block-swatch ${is_disabled}">
                    <input
                      class="block-swatch__radio visually-hidden"
                      type="radio"
                      name="size_radio"
                      form="cart-form"
                      id="${checked_available_size[index]}"
                      value="${checked_available_size[index]}"
                      checked="checked"
                    />
                    <label
                      class="block-swatch__item"
                      for="${checked_available_size[index]}"
                      >${checked_available_size[index]}</label
                    >
                  </div>`
          );
        } else {
          size_list.append(
            `<div class="block-swatch ${is_disabled}">
                    <input
                      class="block-swatch__radio visually-hidden"
                      type="radio"
                      name="size_radio"
                      form="cart-form"
                      id="${checked_available_size[index]}"
                      value="${checked_available_size[index]}"
                    />
                    <label
                      class="block-swatch__item"
                      for="${checked_available_size[index]}"
                      >${checked_available_size[index]}</label
                    >
                  </div>`
          );
        }
      }
    }

    //  -------- Show Sizes Fuction --------

    // console.log(checked_varient.sizes);
    function show_buttons() {
      selected_size = $(".block-swatch__radio:checked").attr("value");
      size_lable.text(selected_size);
      $(".quantity-selector__input").val(1);

      if (checked_varient.sizes[selected_size] == 0) {
        $(".sold-out").css("display", "block");
        $("#buy-buttons").hide();
      } else {
        $(".sold-out").css("display", "none");
        $("#buy-buttons").show();
      }
    }

    // ------------ Product Image Zoom ------------
    function image_zoom() {
      $("#main").ezPlus({
        zoomType: "inner",
        cursor: "crosshair",
        easing: true,
        scrollZoom: true,
        zoomWindowFadeIn: 500,
        zoomWindowFadeOut: 500,
        borderSize: 0,
        responsive: true,
      });
    }
    // --------------------------------------------------------
    // --------------------------------------------------------
  });

  // --------------------------------------------------------
  // --------------------------------------------------------
});
