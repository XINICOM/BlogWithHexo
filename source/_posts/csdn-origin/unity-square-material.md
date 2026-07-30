---
title: Unity 正方体重复平铺材质
date: 2026-07-30 15:31:55
tags:
    - Unity
    - CSharp
    - Material
    - Shader
categories:
    - 编程
    - 游戏开发
    - Unity
column:
    title: "Unity 开发经验"
    order: 2
header_callout:
    - level: "note"
      title: "本文在此处不是首发"
      detailFilePath: "_header-callout/usm.md"
---

# 引言

在开发中使用贴图的时候要做出重复平铺的效果。同时一个Shader要用在多个不同物体上面，要根据物体自动改变贴图的块数。（物体只支持Cube）

为这个提供一个大致的解决想法，只是完成了 1 * 1 大小比例的贴图，像铺地砖一样贴在物体上。

# 制作

1. 创建 Editor 文件夹（必须，不然打包时会出问题）
2. 在任意文件夹 下创建一个名为 MeshUv 的 C# 脚本文件，并在文件中使用以下代码：

    ```cs MeshUv.cs | lang:C#
    using UnityEngine;

    public class MeshUv : MonoBehaviour
    {
        public void Applying()
        {
            //获得信息
            Mesh mesh = new Mesh();
            Vector3 Scale = transform.localScale;
            #if UNITY_EDITOR
                MeshFilter mf = GetComponent<MeshFilter>();
                Mesh meshCopy = Mesh.Instantiate(mf.sharedMesh) as Mesh;
                mesh = meshCopy;
            #else
                mesh = GetComponent<MeshFilter>().mesh;
            #endif

            //UV变量
            Vector2[] uvs = new Vector2[mesh.uv.Length];
            for (int i = 0; i < uvs.Length; i++)
            {
                uvs[i] = new Vector2(0, 0);
            }

            //依据信息改变变量
            //x所对面
            uvs[21] = new Vector2(0, Scale.y);
            uvs[22] = new Vector2(Scale.z, Scale.y);
            uvs[23] = new Vector2(Scale.z, 0);
            //y所对面
            uvs[4] = new Vector2(0, Scale.z);
            uvs[5] = new Vector2(Scale.x, Scale.z);
            uvs[9] = new Vector2(Scale.x, 0);
            //z所对面
            uvs[1] = new Vector2(Scale.x, 0);
            uvs[2] = new Vector2(0, Scale.y);
            uvs[3] = new Vector2(Scale.x, Scale.y);
            //-x所对面
            uvs[17] = new Vector2(0, Scale.y);
            uvs[18] = new Vector2(Scale.z, Scale.y);
            uvs[19] = new Vector2(Scale.z, 0);
            //-y所对面
            uvs[13] = new Vector2(0, Scale.z);
            uvs[14] = new Vector2(Scale.x, Scale.z);
            uvs[15] = new Vector2(Scale.x, 0);
            //-z所对面
            uvs[6] = new Vector2(0, Scale.y);
            uvs[7] = new Vector2(Scale.x, Scale.y);
            uvs[11] = new Vector2(Scale.x, 0);

            //赋值
            mesh.uv = uvs;
            mesh.RecalculateBounds();
            mesh.RecalculateNormals();
            mesh.RecalculateTangents();
            GetComponent<MeshFilter>().mesh = mesh;
        }
    }
    ```

3. 在 Editor 文件夹下创建一个名为 TextureUvEditor 的 C# 脚本文件，并在文件中使用以下代码：

    ```cs TextureUvEditor.cs | lang:C#
    using UnityEditor;
    using UnityEngine;

    [CustomEditor(typeof(MeshUv))]
    public class TextureUvEditor : Editor
    {
        private MeshUv meshUv;

        private void OnEnable()
        {
            meshUv = target as MeshUv;
        }

        public override void OnInspectorGUI()
        {
            base.OnInspectorGUI();
            if (GUILayout.Button("APPLY"))
            {
                meshUv.Applying();
            }
        }
    }
    ```

4. 将图片导入，设置参考如下：

    {% asset_img p-reference-setting.png '图片参考设置' %}

5. 制作材质球，设置参考如下：

    {% asset_img m-reference-setting.png '材质球参考设置' %}

6. 将材质球和 MeshUv.cs 拖拽赋予给一个 Cube，随意缩放点击 APPLY 按钮，即可自动贴图：

    {% asset_img auto1.png '自动贴图效果 1' %}

    {% asset_img auto2.png '自动贴图效果 2' %}

# 原理

## UV

要详细理解，第一应该先知道 UV 是什么，按我理解就是：把平面的图像（贴图）映射到三维模型上的一种坐标，为了告诉电脑如何显示贴图。而 UV 两个字母就类比成 XYZ 吧，反正都是显示坐标用的。（其实 UV 使用 W 方向的坐标的，但是一般不常用就不说了）

参考 [听雨眠丨](https://blog.csdn.net/qq_40629631?type=blog) 所写的 [Unity 中 Mesh 的 uv 坐标讨论与使用方法](https://blog.csdn.net/qq_40629631/article/details/106055006) 便于理解

## 法向

理解了上文之后，我们一个物体要有棱角，必须告诉计算机每一个面的方向。

{% asset_img n-vec.png '法线方向图解' %}

Unity 里面的法向遵守“左手定律”，即四指弯曲方向为数字增加方向，大拇指方向为法向方向。

这么来看，对于一个立方体来说仅用 8 个 UV 点来完全表示每一个面，并且做到法向的统一向外是不可能的，那么就把每一个面拆开来，各自用 4 个 UV 点表示，一共 24 个 UV 点。

## 内置 Cube 的 UV 点布局

接下来就要看以下 Unity 内部的 Cube Mesh 是如何分配这 24 个 UV 点的。

{% asset_img uv-dot.png 'UV 点图解' %}

上图用 1 ~ 24 标注了 6 个面的 UV 点  
下表写了每个 UV 点初始的数值

```txt
（0，0）
（1，0）
（0，1）
（1，1）
（0，1）
（1，1）
（0，1）
（1，1）
（0，0）
（1，0）
（0，0）
（1，0）
（0，0）
（0，1）
（1，1）
（1，0）
（0，0）
（1，1）
（1，1）
（1，0）
（0，0）
（0，1）
（1，1）
（1，0）
```

通过对 UV 的了解我们可以知道当数值超过 1 时，会使贴图开始重复排列。

## 更改数值

```cs | lang:C#
Mesh mesh = new Mesh();
Vector3 Scale = transform.localScale;
#if UNITY_EDITOR
    MeshFilter mf = GetComponent<MeshFilter>();
    Mesh meshCopy = Mesh.Instantiate(mf.sharedMesh) as Mesh;
    mesh = meshCopy;
#else
    mesh = GetComponent<MeshFilter>().mesh;
#endif
```

用于获取其他组件的基础信息

> [!note]
> 注意我用了宏定义，因为不写这个在 编辑器 里面调用会报错（虽然这个错误不致命），
> 而在游玩模式中调用则不需要这样。（想在编辑器中调用 #if UNITY_EDITOR 后面写的那三行是必须的！）

---

```cs | lang:C#
Vector2[] uvs = new Vector2[mesh.uv.Length];
for (int i = 0; i < uvs.Length; i++)
{
    uvs[i] = new Vector2(0, 0);
}
```

用于创建一个基础数值全为 (0,0) 的数组，作为 UV 点组

---

```cs | lang:C#
//x所对面
uvs[21] = new Vector2(0, Scale.y);
uvs[22] = new Vector2(Scale.z, Scale.y);
uvs[23] = new Vector2(Scale.z, 0);
//y所对面
uvs[4] = new Vector2(0, Scale.z);
uvs[5] = new Vector2(Scale.x, Scale.z);
uvs[9] = new Vector2(Scale.x, 0);
//z所对面
uvs[1] = new Vector2(Scale.x, 0);
uvs[2] = new Vector2(0, Scale.y);
uvs[3] = new Vector2(Scale.x, Scale.y);
//-x所对面
uvs[17] = new Vector2(0, Scale.y);
uvs[18] = new Vector2(Scale.z, Scale.y);
uvs[19] = new Vector2(Scale.z, 0);
//-y所对面
uvs[13] = new Vector2(0, Scale.z);
uvs[14] = new Vector2(Scale.x, Scale.z);
uvs[15] = new Vector2(Scale.x, 0);
//-z所对面
uvs[6] = new Vector2(0, Scale.y);
uvs[7] = new Vector2(Scale.x, Scale.y);
uvs[11] = new Vector2(Scale.x, 0);
```

根据各个面上面所对应的 UV 点，按照 transform.localScale 的数据进行赋值

---

```cs | lang:C#
mesh.uv = uvs;
GetComponent<MeshFilter>().mesh = mesh;
```

最后再把数值赋值回去就可以了，因为没有改变原有的布局所以

```cs | lang:C#
mesh.RecalculateBounds();
mesh.RecalculateNormals();
mesh.RecalculateTangents();
```

都不用使用

## 编辑器

```cs | lang:C#
private MeshUv meshUv;

private void OnEnable()
{
    meshUv = target as MeshUv;
}

public override void OnInspectorGUI()
{
    base.OnInspectorGUI();
    if (GUILayout.Button("APPLY"))
    {
        meshUv.Applying();
    }
}
```

其实就是绑定在 MeshUv 上，然后再界面上创建一个按钮用来调用 Applying() 。
