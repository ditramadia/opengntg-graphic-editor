// Dropdown menu
document.addEventListener("DOMContentLoaded", function () {
    var logo = document.getElementById("logo");
    var dropdown = document.querySelector(".dropdown-menu");

    // Toggle dropdown menu
    logo.addEventListener("click", function () {
        this.classList.toggle("open");
    });

    // Close dropdown menu when clicking outside
    document.addEventListener("click", function (event) {
        var isClickInsideDropdown = dropdown.contains(event.target);
        var isClickInsideLogo = logo.contains(event.target);

        if (!isClickInsideDropdown && !isClickInsideLogo) {
            logo.classList.remove("open");
        }
    });

    // Dropdown item click event
    var dropdownItems = document.querySelectorAll(".dropdown-menu li");
    dropdownItems.forEach(function(item) {
        item.addEventListener("click", function() {
            var selectedItemText = this.textContent;
            if (selectedItemText === "New File") {
                clearShapes();
                showLog("New File");
            } else if (selectedItemText === "Import Shape") {
                // open file dialog
                var input = document.createElement("input");
                input.type = "file";
                input.accept = ".json";
                input.onchange = function (event) {
                    var file = event.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function() {
                        importShapes(reader.result);
                    };
                    reader.readAsText(file);
                };
                input.click();

                showLog("Import Shape");
            } else if (selectedItemText === "Help") {
                showLog("Help");
            }
        });
    });
});
