﻿//------------------------------------------------------------------------------
// <auto-generated>
//     Этот код создан программой.
//     Исполняемая версия:4.0.30319.42000
//
//     Изменения в этом файле могут привести к неправильной работе и будут потеряны в случае
//     повторной генерации кода.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Olx.BLL.Resources {
    using System;
    
    
    /// <summary>
    ///   Класс ресурса со строгой типизацией для поиска локализованных строк и т.д.
    /// </summary>
    // Этот класс создан автоматически классом StronglyTypedResourceBuilder
    // с помощью такого средства, как ResGen или Visual Studio.
    // Чтобы добавить или удалить член, измените файл .ResX и снова запустите ResGen
    // с параметром /str или перестройте свой проект VS.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "17.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class Errors {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Errors() {
        }
        
        /// <summary>
        ///   Возвращает кэшированный экземпляр ResourceManager, использованный этим классом.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("Olx.BLL.Resources.Errors", typeof(Errors).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Перезаписывает свойство CurrentUICulture текущего потока для всех
        ///   обращений к ресурсу с помощью этого класса ресурса со строгой типизацией.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Ищет локализованную строку, похожую на Action blocked.
        /// </summary>
        internal static string ActionBlocked {
            get {
                return ResourceManager.GetString("ActionBlocked", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Ищет локализованную строку, похожую на Curent password is not valid.
        /// </summary>
        internal static string CurentPasswordIsNotValid {
            get {
                return ResourceManager.GetString("CurentPasswordIsNotValid", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Ищет локализованную строку, похожую на Image sizes not initializing.
        /// </summary>
        internal static string ImageSizesInitError {
            get {
                return ResourceManager.GetString("ImageSizesInitError", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Ищет локализованную строку, похожую на Error read image sizes.
        /// </summary>
        internal static string ImageSizesReadError {
            get {
                return ResourceManager.GetString("ImageSizesReadError", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Ищет локализованную строку, похожую на Confirmation data error.
        /// </summary>
        internal static string InvalidConfirmationData {
            get {
                return ResourceManager.GetString("InvalidConfirmationData", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Ищет локализованную строку, похожую на Invalid login or password.
        /// </summary>
        internal static string InvalidLoginData {
            get {
                return ResourceManager.GetString("InvalidLoginData", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Ищет локализованную строку, похожую на Invalid reser password data.
        /// </summary>
        internal static string InvalidResetPasswordData {
            get {
                return ResourceManager.GetString("InvalidResetPasswordData", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Ищет локализованную строку, похожую на Invalid token.
        /// </summary>
        internal static string InvalidToken {
            get {
                return ResourceManager.GetString("InvalidToken", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Ищет локализованную строку, похожую на Invalid user email.
        /// </summary>
        internal static string InvalidUserEmail {
            get {
                return ResourceManager.GetString("InvalidUserEmail", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Ищет локализованную строку, похожую на Invalid user id.
        /// </summary>
        internal static string InvalidUserId {
            get {
                return ResourceManager.GetString("InvalidUserId", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Ищет локализованную строку, похожую на Error read JWT setting.
        /// </summary>
        internal static string JwtSettingsReadError {
            get {
                return ResourceManager.GetString("JwtSettingsReadError", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Ищет локализованную строку, похожую на User creation error.
        /// </summary>
        internal static string UserCreateError {
            get {
                return ResourceManager.GetString("UserCreateError", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Ищет локализованную строку, похожую на User remove error.
        /// </summary>
        internal static string UserRemoveError {
            get {
                return ResourceManager.GetString("UserRemoveError", resourceCulture);
            }
        }
    }
}
