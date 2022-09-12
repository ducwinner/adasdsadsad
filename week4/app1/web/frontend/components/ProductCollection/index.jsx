import { useState, useCallback, useMemo } from 'react';
import React from 'react';
import {
  Card,
  Avatar,
  ResourceList,
  ResourceItem,
  Tag,
  Listbox,
  Combobox,
  Icon,
  TextContainer,
  Stack,
} from '@shopify/polaris';
import { MobileCancelMajor, SearchMinor } from '@shopify/polaris-icons';
import '../../styles/components/SpecificProducts.css';
import productAll from '../../data/productAll';


function ProductCollection() {

  //   const listItemSelected = useMemo(() => productAll.filter((product) => selectedItems.includes(product.id)),[selectedItems]);
  const deselectedOptions = useMemo(
    () => [
      { value: 'rustic', label: 'Rustic' },
      { value: 'antique', label: 'Antique' },
      { value: 'vinyl', label: 'Vinyl' },
      { value: 'vintage', label: 'Vintage' },
      { value: 'refurbished', label: 'Refurbished' },
    ],
    []
  );


  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(deselectedOptions);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === '') {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = deselectedOptions.filter((option) => option.label.match(filterRegex));
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const updateSelection = useCallback(
    (selected) => {
      if (selectedOptions.includes(selected)) {
        setSelectedOptions(selectedOptions.filter((option) => option !== selected));
      } else {
        setSelectedOptions([...selectedOptions, selected]);
      }

      const matchedOption = options.find((option) => {
        return option.value.match(selected);
      });

      updateText('');
    },
    [options, selectedOptions, updateText]
  );

  const removeTag = useCallback(
    (tag) => () => {
      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
    },
    [selectedOptions]
  );

  const tagsMarkup = selectedOptions.map((option) => (
    <Tag key={`option-${option}`} onRemove={removeTag(option)}>
      {option}
    </Tag>
  ));

  const optionsMarkup =
    options.length > 0
      ? options.map((option) => {
          const { label, value } = option;

          return (
            <Listbox.Option
              key={`${value}`}
              value={value}
              selected={selectedOptions.includes(value)}
              accessibilityLabel={label}
            >
              {label}
            </Listbox.Option>
          );
        })
      : null;

  return (
    <div className="specific-products">
      <Combobox
        allowMultiple
        activator={
          <Combobox.TextField
            prefix={<Icon source={SearchMinor} />}
            onChange={updateText}
            label="Search tags"
            labelHidden
            value={inputValue}
            placeholder="Search tags"
          />
        }
      >
        {optionsMarkup ? (
          <Listbox autoSelection="NONE" onSelect={updateSelection}>
            {optionsMarkup}
          </Listbox>
        ) : null}
      </Combobox>
      <TextContainer>
        <Stack>{tagsMarkup}</Stack>
      </TextContainer>
      <Card>
        <ResourceList
          resourceName={{ singular: 'customer', plural: 'customers' }}
          items={productAll}
          renderItem={(item) => {
            const { id, url, avatarSource, name, location } = item;

            return (
              <ResourceItem
                key={id}
                id={id}
                url={url}
                media={
                  <Avatar customer size="Large" name={name} source={avatarSource} shape="square" />
                }
                accessibilityLabel={`View details for ${name}`}
                name={name}
              >
                <div className="resourceItem">
                  <div style={{ lineHeight: '60px' }}>{location}</div>
                  <Icon source={MobileCancelMajor} color="base" />
                </div>
              </ResourceItem>
            );
          }}
        />
      </Card>
    </div>
  );
}

export default ProductCollection;
