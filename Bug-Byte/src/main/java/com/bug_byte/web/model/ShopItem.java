package com.bug_byte.web.model;


import jakarta.persistence.*;

@Entity
@Table(name = "shopItem")
public class ShopItem {
    @Id
    private String id;

    @Column(nullable = false)
    private String groupType;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private String image;


    public ShopItem(String id, String groupType, String name, int price, String image) {
        this.id = id;
        this.groupType = groupType;
        this.name = name;
        this.price = price;
        this.image = image;
    }

    public ShopItem() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
