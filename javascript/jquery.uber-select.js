(function ( $ ) {
  $.fn.uberSelect = function (opts) {
    this.each(function () {
      var select = this;

      var options = $.extend({
        prepopulateSearchOnOpen: false,                                                   // Should the search input start with the selected value in it when the pane is opened?
        clearSearchClearsSelect: false,                                                   // Should the select value be cleared When the search is cleared?
        placeholder: $(select).attr('placeholder') || $(select).attr('data-placeholder')  // Placeholder to show in the selected text area
      }, opts, $(select).data('uber-options'));

      options.value = $(select).val();                                                       // Initialize the UberSearch with this selected value

      var uberSearch = new UberSearch(dataFromSelect(select), options);


      // BEHAVIOUR

      // When the UberSearch pane is opened
      $(uberSearch).on('shown', function () {
        if (options.prepopulateSearchOnOpen) {
          updateSearchValueFromSelect();
        }
      });

      // When the clear search button is clicked
      $(uberSearch).on('clear', function () {
        if (options.clearSearchClearsSelect) {
          clearSelect();
        }
      });

      // When the select value changes
      $(select).on('uber-select:refresh change', updateSelectedValue);

      // When a result is selected
      $(uberSearch).on('select', function (_, datum) {
        updateSelectValue(datum.value);
      });


      // INITIALIZATION

      uberSearch.view.insertBefore(select).append(select);
      $(select).hide();


      // HELPER FUNCTIONS

      // Given a select element
      // Returns an array of data to match against
      function dataFromSelect(select) {
        return $.map($(select).find('option'), function (option) {
          var optgroup = $(option).closest('optgroup');
          var group = optgroup.attr('label');
          var visibility = $(option).data('visibility') || optgroup.data('visibility');
          var text = $(option).text();
          var matchValue = $(option).data('match-value');
          var value = $(option).attr('value');

          return { text:text, value:value, matchValue:matchValue, visibility:visibility, group:group, element:option };
        });
      }

      // Copies the value of the select into the search input
      function updateSearchValueFromSelect() {
        uberSearch.searchField.input.val($(select).find('option:selected').text());
        uberSearch.searchField.refresh();
      }

      // Updates the UberSearch's selected value from the select element's value
      function updateSelectedValue() {
        uberSearch.setValue($(select).val());
      }

      function updateSelectValue(value) {
        $(select).val(value).change();
      }

      // Selects the option with an emptystring value, or the first option if there is no blank option
      function clearSelect() {
        var selectValue = $(select).val();

        // If the select is already cleared, avoid firing a change event
        if (!selectValue) { return; }

        // Clear the value
        $(select).val('').change();

        // If that cleared it then we're done, otherwise, select the first option
        if ($(select).find('option:selected').length) { return; }

        var fistOptionValue = $(select).find('option').prop('value');

        // If the first option is already set then we're done, otherwise, select the first option
        if (fistOptionValue === selectValue) { return; }

        // Select the first option
        $(select).val(fistOptionValue).change();
      }
    });

    return this;
  };
}( jQuery ));
